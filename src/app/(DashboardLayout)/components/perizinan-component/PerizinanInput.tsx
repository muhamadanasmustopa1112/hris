import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Grid, CircularProgress,
  Typography,
  Snackbar,
  SnackbarCloseReason,
  Alert
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';


interface JenisIzin {
    id: number;
    name: string;
}
interface Category {
    id: number;
    name: string;
}
  
interface Employee {
    id: number;
    name: string;
}

const PerizinanInput: React.FC = () => {

  const [jenis_izins, setJenisIzins] = useState<JenisIzin[]>([]);
  const [categorys, setCategory] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const isAdmin = user?.roles[0].name === "admin";

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  const [formData, setFormData] = useState<{ [key: string]: any }>({
    jenis_izin_id: '',
    category_id: '',
    companies_users_id: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    jam_masuk: '',
    jam_keluar: '',
    keterangan: '',
    status: '',
    lampiran: null,
  });

  
  useEffect(() => {
    if (!isAdmin) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        status: 'On Prosses',
        companies_users_id: user?.companies_users_id,
      }));
    }
  }, [isAdmin, user?.companies_users_id, basicAuth]);

  
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/get-employee', {
        method: 'GET',
        credentials: 'include',
      });      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEmployees(data.data);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJenisIzin = useCallback(async () => {
    try {
      const response = await axios.get('https://backend-apps.ptspsi.co.id/api/jenis-izin', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      if (Array.isArray(response.data.data)) {
        setJenisIzins(response.data.data);
      } else {
        console.error('Expected an array, but got:', typeof response.data);
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  }, [basicAuth]);

  const fetchCategory = useCallback(async () => {
    try {
      const response = await axios.get('https://backend-apps.ptspsi.co.id/api/category-izin', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      if (Array.isArray(response.data.data)) {
        setCategory(response.data.data);
      } else {
        console.error('Expected an array, but got:', typeof response.data);
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  }, [basicAuth]);

  useEffect(() => {
    fetchJenisIzin();
    fetchCategory();
    fetchEmployees();
  }, [basicAuth, fetchJenisIzin, fetchCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
  
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    
    const file = acceptedFiles[0];
    setUploadedFileName(null);
    setProgress(0);

    setFormData((prev) => ({
      ...prev,
      lampiran: file, 
    }));

    
    const totalDuration = 5000; 
    const interval = 100; 
    const increment = 100 / (totalDuration / interval);

    const intervalId = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + increment, 100);
        if (newProgress === 100) {
          clearInterval(intervalId);
          setUploadedFileName(file.name);
        }
        return newProgress;
      });
    }, interval);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    try {
      const response = await axios.post('https://backend-apps.ptspsi.co.id/api/perizinan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Basic ${basicAuth}`
        },
      });

      setAlertMessage('Pengajuan Izin/Cuti berhasil dibuat!');
      setAlertSeverity('success');
      setOpen(true);

    } catch (error) {

      if (axios.isAxiosError(error)) {

        const errorMessages = error.response?.data?.errors;

        if (errorMessages) {
          const message = Object.values(errorMessages).flat().join(', ') || 'Terjadi kesalahan';
          console.error('Validation errors:', message);
          setAlertMessage(message);
          
        } else {
          console.error('Error response without validation errors:', error.response?.data);
          setAlertMessage('Terjadi kesalahan');
        }

        setAlertSeverity('error');
        setOpen(true);

      } else {
        console.error('Error creating perizinan:', error);
      }

    }
  };

  const handleSnackbarClose = (
    event: SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return; 
    }
    setOpen(false); 
  };

  const handleAlertClose = (event: SyntheticEvent) => {
    setOpen(false); 
    router.push('/perizinan/data-perizinan');    
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}> 
        <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth required>
                <InputLabel>Jenis Izin</InputLabel>
                <Select
                    name="jenis_izin_id"
                    value={formData.jenis_izin_id}
                    onChange={handleSelectChange}
                    label="Jenis Izin"
                >
                    <MenuItem value=""><em>Select Jenis Izin</em></MenuItem>
                    {jenis_izins.map((jenis_izin) => (
                    <MenuItem key={jenis_izin.id} value={jenis_izin.id}>
                        {jenis_izin.name}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}> 
            <FormControl variant="outlined" fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleSelectChange}
                    label="Category"
                >
                    <MenuItem value=""><em>Select Category Izin</em></MenuItem>
                    {categorys.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
      </Grid>
      {isAdmin && (
        <FormControl variant="outlined" fullWidth required>
          <InputLabel>Employee</InputLabel>
          <Select
              name="companies_users_id"
              value={formData.companies_users_id}
              onChange={handleSelectChange}
              label="Employee"
          >
              <MenuItem value=""><em>Select Companies User</em></MenuItem>
              {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
              </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Tanggal Mulai"
            name="tanggal_mulai"
            type="date"
            value={formData.tanggal_mulai}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Tanggal Selesai"
            name="tanggal_selesai"
            type="date"
            value={formData.tanggal_selesai}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Jam Masuk"
            name="jam_masuk"
            type="time"
            value={formData.jam_masuk}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Jam Keluar"
            name="jam_keluar"
            type="time"
            value={formData.jam_keluar}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      <TextField
        label="Keterangan"
        name="keterangan"
        type="text"
        value={formData.keterangan}
        onChange={handleInputChange}
        fullWidth
        required
        multiline
        rows={3}
      />
      {isAdmin && (
        <FormControl  variant="outlined" fullWidth required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleSelectChange}
            label="Employee"
          >
            <MenuItem value=""><em>Select Status</em></MenuItem>
            <MenuItem value="Success">Success</MenuItem>
            <MenuItem value="Decline">Decline</MenuItem>
            <MenuItem value="On Prosses">On Prosses</MenuItem>
          </Select>
        </FormControl>
      )}
      <div {...getRootProps()} style={{
        border: '2px dashed gray',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '4px',
        position: 'relative'
      }}>
        <input {...getInputProps()} />
        {progress > 0 && progress < 100 ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress variant="determinate" value={progress} />
            <Typography variant="body2" sx={{ marginTop: '10px' }}>
              {`Uploading... ${Math.round(progress)}%`}
            </Typography>
          </div>
        ) : uploadedFileName ? (
          <p>File Uploaded: {uploadedFileName}</p>
        ) : (
          <p>{isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}</p>
        )}
      </div>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alertSeverity} 
          sx={{ 
            width: '100%', 
            backgroundColor: alertSeverity === 'success' ? 'green' : 'red',
            color: 'white' 
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PerizinanInput;


