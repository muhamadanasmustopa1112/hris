import React, { SyntheticEvent, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  FormLabel,
  Snackbar,
  Alert,
  SelectChangeEvent,
  SnackbarCloseReason,
  
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface Division {
  id: number;
  name: string;
}

interface Jabatan {
  id: number;
  name: string;
}

const EmployeeInput: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [jabatans, setJabatans] = useState<Jabatan[]>([]);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    nik: '',
    no_kk: '',
    name: '',
    gender: '',
    tgl_lahir: '',
    tempat_lahir: '',
    no_hp: '',
    email: '',
    no_hp_darurat: '',
    status: '',
    alamat: '',
    bpjs_kesehatan: '',
    bpjs_ketenagakerjaan: '',
    npwp: '',
    foto_karyawan: null,
    ktp_karyawan: null,
    ijazah_karyawan: null,
    company_id: '',
    division_id: '',
    jabatan_id: '',
  });

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();

  useEffect(() => {
    const fetchDivisions = async () => {

      const userCookie = Cookies.get('user');
      const user = userCookie ? JSON.parse(userCookie) : null;
  
      if (!user || !user.company_id) {
          alert("DATA NOT FOUND!");
        return;
      }

      try {

        const response = await axios.get('http://127.0.0.1:8000/api/division', {
          params: {
            company_id: user.company_id,
          },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setDivisions(response.data.data);
        } else {
          console.error('Expected an array, but got:', typeof response.data);
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    fetchDivisions();
  }, []);

  useEffect(() => {
    const fetchJabatans = async () => {

      const userCookie = Cookies.get('user');
      const user = userCookie ? JSON.parse(userCookie) : null;
  
      if (!user || !user.company_id) {
          alert("DATA NOT FOUND!");
        return;
      }

      try {

        const response = await axios.get('http://127.0.0.1:8000/api/jabatan', {
          params: {
            company_id: user.company_id,
          },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setJabatans(response.data.data);
        } else {
          console.error('Expected an array, but got:', typeof response.data);
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    fetchJabatans();
  }, []);

   useEffect(() => {
    const userCookie = Cookies.get('user');

    if (userCookie) {
      try {
        const userParsed = JSON.parse(userCookie);
        setUser(userParsed);

        if (userParsed.company_id) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            company_id: userParsed.company_id,
          }));
        } else {
          console.log('Company ID tidak ditemukan dalam cookie user');
        }

      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }

    } else {
      console.log('Cookie user tidak ditemukan');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target;

    if (type === 'file' && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    } else {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-company-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });
      console.log('Employee created:', response);

      setAlertMessage('Karyawan berhasil dibuat!');
      setAlertSeverity('success');
      setOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessages = error.response?.data.errors;
        const message = Object.values(errorMessages).flat().join(', ') || 'Terjadi kesalahan';
        console.error('Validation errors:', message);
        setAlertMessage(message);
        setAlertSeverity('error');
        setOpen(true);
      } else {
        console.error('Error creating employee:', error);
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
    router.push('/employees/data-employee');    
  };

  return (
    <Paper style={{ padding: '16px' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="NIK"
              variant="outlined"
              fullWidth
              name="nik"
              value={formData.nik}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="No KK"
              variant="outlined"
              fullWidth
              name="no_kk"
              value={formData.no_kk}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange}
                label="Gender"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                <MenuItem value="Perempuan">Perempuan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tanggal Lahir"
              variant="outlined"
              type="date"
              fullWidth
              name="tgl_lahir"
              value={formData.tgl_lahir}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tempat Lahir"
              variant="outlined"
              fullWidth
              name="tempat_lahir"
              value={formData.tempat_lahir}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="No HP"
              variant="outlined"
              fullWidth
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
           <FormControl variant="outlined" fullWidth required>
              <InputLabel>Jabatan</InputLabel>
              <Select
                name="jabatan_id"
                value={formData.jabatan_id}
                onChange={handleSelectChange}
                label="Jabatan"
              >
                <MenuItem value=""><em>Select Jabatan</em></MenuItem>
                {jabatans.map((jabatan) => (
                  <MenuItem key={jabatan.id} value={jabatan.id}>
                    {jabatan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Divisi</InputLabel>
              <Select
                name="division_id"
                value={formData.division_id}
                onChange={handleSelectChange}
                label="Divisi"
              >
                <MenuItem value=""><em>Select Divisi</em></MenuItem>
                {divisions.map((division) => (
                  <MenuItem key={division.id} value={division.id}>
                    {division.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="No HP Darurat"
              variant="outlined"
              fullWidth
              name="no_hp_darurat"
              value={formData.no_hp_darurat}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label="status"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Non Active">Non Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Alamat"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="BPJS Kesehatan"
              variant="outlined"
              fullWidth
              name="bpjs_kesehatan"
              value={formData.bpjs_kesehatan}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="BPJS Ketenagakerjaan"
              variant="outlined"
              fullWidth
              name="bpjs_ketenagakerjaan"
              value={formData.bpjs_ketenagakerjaan}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="NPWP"
              variant="outlined"
              fullWidth
              name="npwp"
              value={formData.npwp}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Foto Karyawan</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                type="file"
                inputProps={{ accept: 'image/*' }}
                name="foto_karyawan"
                onChange={handleChange}
                
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>KTP Karyawan</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                type="file"
                inputProps={{ accept: 'image/*' }}
                name="ktp_karyawan"
                onChange={handleChange}
                
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Ijazah Karyawan</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                type="file"
                inputProps={{ accept: 'image/*' }}
                name="ijazah_karyawan"
                onChange={handleChange}
                
              />
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Submit
        </Button>
      </form>

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
    </Paper>
  );
};

export default EmployeeInput;
