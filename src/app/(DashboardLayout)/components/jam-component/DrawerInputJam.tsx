import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from 'js-cookie';

interface DrawerInputJamtProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Shift {
    id: number;
    name: string;
}

const DrawerInputJam: React.FC<DrawerInputJamtProps> = ({ open, onClose, onSuccess }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftId, setShiftId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jamMasuk, setJamMasuk] = useState('');
  const [jamKeluar, setJamKeluar] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleAddJam = async () => {

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
      setSnackbarMessage('Gagal mengambil data perusahaan.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {

      const response = await axios.post('http://127.0.0.1:8000/api/jam', {
          shift_id: shiftId,
          jam_masuk: jamMasuk,
          jam_keluar: jamKeluar,
        }, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        }
      );

      if (response.data.message === 'success') {
        setSnackbarMessage('Jam berhasil ditambahkan!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setShiftId(''); 
        setJamMasuk(''); 
        setJamKeluar(''); 
        onSuccess();
        onClose(); 
      }
    } catch (error) {
      setSnackbarMessage('Gagal menambahkan Jam.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchShifts = async () => {

        setLoading(true);
        const userCookie = Cookies.get('user');
        const user = userCookie ? JSON.parse(userCookie) : null;

        if (!user || !user.company_id) {
            alert("DATA NOT FOUND!");
        return;
        }
        
        try {
        
        const response = await axios.get('http://127.0.0.1:8000/api/shift-active', {
            params: {
            company_id: user.company_id,
            },
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            }
        });

        if (Array.isArray(response.data.data)) {
            setShifts(response.data.data);
        } else {
            console.error('Expected an array, but got:', typeof response.data);
        }
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
    fetchShifts();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 300,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Jam</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-company-user-label">Shift Name</InputLabel>
            <Select
              labelId="select-company-user-label"
              value={shiftId}
              label="Shift Name"
              onChange={(e) => setShiftId(e.target.value)}
            >
              {shifts.map((shift) => (
                <MenuItem key={shift.id} value={shift.id}>
                  {shift.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Jam Masuk"
            type="time"
            value={jamMasuk}
            onChange={(e) => setJamMasuk(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Jam Keluar"
            type="time"
            value={jamKeluar}
            onChange={(e) => setJamKeluar(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddJam}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Add Jam'}
          </Button>
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
            sx={{ width: '100%', color:'white', backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
        >
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerInputJam;
