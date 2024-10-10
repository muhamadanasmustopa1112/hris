import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Grid, CircularProgress,
  Typography
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';


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


  const [formData, setFormData] = useState<{ [key: string]: any }>({
    jenis_perizinan_id: '',
    category_id: '',
    companies_user_id: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    jam_masuk: '',
    jam_keluar: '',
    keterangan: '',
    status: '',
    lampiran: null,
  });


  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/get-employee');
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

  const fetchJenisIzin = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/jenis-izin');
      if (Array.isArray(response.data.data)) {
        setJenisIzins(response.data.data);
      } else {
        console.error('Expected an array, but got:', typeof response.data);
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/category-izin');
      if (Array.isArray(response.data.data)) {
          setCategory(response.data.data);
      } else {
        console.error('Expected an array, but got:', typeof response.data);
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  useEffect(() => {
    fetchJenisIzin();
    fetchCategory();
    fetchEmployees();
  }, []);


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form data here (e.g., send to API)
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}> 
        <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth required>
                <InputLabel>Jenis Izin</InputLabel>
                <Select
                    name="jenis_perizinan_id"
                    value={formData.jenis_perizinan_id}
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
      <FormControl variant="outlined" fullWidth required>
        <InputLabel>Employee</InputLabel>
        <Select
            name="companies_user_id"
            value={formData.companies_user_id}
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
    </Box>
  );
};

export default PerizinanInput;
