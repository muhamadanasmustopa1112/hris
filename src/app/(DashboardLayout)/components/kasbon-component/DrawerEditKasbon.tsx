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
import Cookies from 'js-cookie';

interface DrawerEditKasbonProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kasbonId: number | null; 
}

interface Employee {
  id: number;
  name: string;
}

const DrawerEditKasbon: React.FC<DrawerEditKasbonProps> = ({ open, onClose, onSuccess, kasbonId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [companyUser, setCompanyUser] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [nominal, setNominal] = useState('');
  const [tenor, setTenor] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  useEffect(() => {
    const fetchKasbonData = async () => {
      if (open && kasbonId) {
        try {
          const response = await axios.get(`https://hris-api.ptspsi.co.id/api/kasbon/${kasbonId}`, {
            headers: {
              'Authorization': `Basic ${basicAuth}`
            }
          });
          setCompanyUser(response.data.data.companies_user_id || ''); 
          setTanggal(response.data.data.tanggal || '');
          setNominal(response.data.data.nominal || '');
          setTenor(response.data.data.tenor || '');
          setKeterangan(response.data.data.keterangan || '');
          setStatus(response.data.data.status || '');
        } catch (error) {
          console.error('Gagal mengambil data kasbon:', error);
          setSnackbarMessage('Gagal mengambil data kasbon.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };
    fetchKasbonData();
  }, [open, kasbonId, basicAuth]);

  const handleSubmit = async () => {
    setLoading(true);
    setSnackbarOpen(false);
    try {
      const response = await fetch(`https://hris-api.ptspsi.co.id/api/kasbon/${kasbonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          companies_users_id: companyUser,
          tanggal: tanggal,
          nominal: nominal,
          tenor: tenor,
          keterangan: keterangan,
          status: status,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Kasbon berhasil diupdate!');
        setSnackbarSeverity('success');
        onClose();
        setSnackbarOpen(true);
        onSuccess();
      } else {
        const errorData = await response.json();
        const message = Object.values(errorData.message).flat().join(', ') || 'Terjadi kesalahan';
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.log("Snackbar opened with error message");
      }
    } catch (error) {
      setSnackbarMessage('Terjadi kesalahan saat memperbarui kasbon');
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
            <Typography variant="h6">Edit Kasbon</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-company-user-label">Name</InputLabel>
            <Select
              labelId="select-company-user-label"
              value={companyUser}
              label="Name"
              onChange={(e) => setCompanyUser(e.target.value)}
            >
              {employees.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Tanggal"
            type="date"
            fullWidth
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Nominal"
            type="number"
            fullWidth
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            margin="normal"
            inputProps={{ min: "0", inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            label="Tenor"
            type="number"
            fullWidth
            value={tenor}
            onChange={(e) => setTenor(e.target.value)}
            margin="normal"
            inputProps={{ min: "0", inputMode: "numeric", pattern: "[0-9]*" }}

          />
          <TextField
            label="Keterangan"
            fullWidth
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
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
              <MenuItem value="On Prosses">On Prosses</MenuItem>
              <MenuItem value="Success">Success</MenuItem>
              <MenuItem value="Decline">Decline</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
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
            sx={{ width: '100%', color:'white' , backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
        >
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerEditKasbon;
