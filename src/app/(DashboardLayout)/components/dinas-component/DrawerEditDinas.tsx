import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface DrawerEditDinasProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  DinasId: number | null;
}

interface Employee {
  id: number;
  name: string;
}

const DrawerEditDinas: React.FC<DrawerEditDinasProps> = ({ open, onClose, onSuccess, DinasId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companyUser, setCompanyUser] = useState('');
  const [tanggal_berangkat, setTanggalBerangkat] = useState('');
  const [tanggal_pulang, setTanggalPulang] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [rejected_reason, setAlasan] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString('base64');

  useEffect(() => {
    const fetchDinasData = async () => {
      if (open && DinasId) {
        try {
          const response = await axios.get(`https://hris-api.ptspsi.co.id/api/perjalanan-dinas/${DinasId}`, {
            headers: {
              Authorization: `Basic ${basicAuth}`,
            },
          });
          console.log('Response data:', response.data);
          const data = response.data;
          setCompanyUser(data.companies_users_id?.toString() || '');
          setTanggalBerangkat(data.tanggal_berangkat || '');
          setTanggalPulang(data.tanggal_pulang?.toString() || '');
          setTujuan(data.tujuan?.toString() || '');
          setKeperluan(data.keperluan?.toString() || '');
          setAlasan(data.rejected_reason || '');
          setStatus(data.status || '');
        } catch (error) {
          console.error('Gagal mengambil data Dinas:', error);
          setSnackbarMessage('Gagal mengambil data Dinas.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };

    fetchDinasData();
  }, [open, DinasId, basicAuth]);

  const handleSubmit = async () => {
    if (!DinasId) return;

    setLoading(true);
    setSnackbarOpen(false);

    try {
      const response = await axios.put(
        `https://hris-api.ptspsi.co.id/api/perjalanan-dinas/${DinasId}`,
        {
          companies_users_id: companyUser,
          tanggal_berangkat,
          tanggal_pulang,
          tujuan,
          keperluan,
          rejected_reason,
          status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
          },
        }
      );

      setSnackbarMessage('Dinas berhasil diupdate!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onSuccess();
      onClose();
    } catch (error: any) {
      let message = 'Terjadi kesalahan saat memperbarui Dinas';
      if (error.response?.data?.message) {
        const errorData = error.response.data.message;
        message = Object.values(errorData).flat().join(', ');
      }
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-employee');
        const data = await response.json();
        setEmployees(data.data);
      } catch (err) {
        console.error('Gagal memuat data karyawan');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [basicAuth]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Edit Dinas</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-company-user-label">Nama Karyawan</InputLabel>
            <Select
              labelId="select-company-user-label"
              value={companyUser}
              label="Nama Karyawan"
              onChange={(e) => setCompanyUser(e.target.value)}
            >
              {employees.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Tanggal Berangkat"
            type="date"
            fullWidth
            value={tanggal_berangkat}
            onChange={(e) => setTanggalBerangkat(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Tanggal Pulang"
            type="date"
            fullWidth
            value={tanggal_pulang}
            onChange={(e) => setTanggalPulang(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Tujuan"
            type="text"
            fullWidth
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Keperluan"
            type="text"
            fullWidth
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Alasan jika ditolak"
            fullWidth
            value={rejected_reason}
            onChange={(e) => setAlasan(e.target.value)}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-status-label">Status</InputLabel>
            <Select
              labelId="select-status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="approved">approved</MenuItem>
              <MenuItem value="pending">pending</MenuItem>
              <MenuItem value="rejected">rejected</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%', color: 'white', backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerEditDinas;
