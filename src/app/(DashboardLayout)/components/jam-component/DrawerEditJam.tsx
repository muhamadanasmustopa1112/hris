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

interface DrawerEditJamProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jamId: number | null; 

}

interface Shift {
    id: number;
    name: string;
}

const DrawerEditJam: React.FC<DrawerEditJamProps> = ({ open, onClose, onSuccess, jamId }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftId, setShiftId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jamMasuk, setJamMasuk] = useState('');
  const [jamKeluar, setJamKeluar] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchJamdata = async () => {
      if (open && jamId) {
        try {
          const response = await axios.get(`https://backend-apps.ptspsi.co.id/api/jam/${jamId}`, {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            }
          });
          setShiftId(response.data.data.shift_id || ''); 
          setJamMasuk(response.data.data.jam_masuk || '');
          setJamKeluar(response.data.data.jam_keluar || '');
        } catch (error) {
          console.error('Gagal mengambil data Jam:', error);
          setSnackbarMessage('Gagal mengambil data Jam.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };
    fetchJamdata();
  }, [open, jamId]);

  const handleSubmit = async () => {
    setLoading(true);
    setSnackbarOpen(false);
    try {
      const response = await fetch(`https://backend-apps.ptspsi.co.id/api/jam/${jamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          shift_id: shiftId,
          jam_masuk: jamMasuk,
          jam_keluar: jamKeluar,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Jam berhasil diupdate!');
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
      setSnackbarMessage('Terjadi kesalahan saat memperbarui Jam');
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
        
        const response = await axios.get('https://backend-apps.ptspsi.co.id/api/shift-active', {
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
            <Typography variant="h6">Edit Jam</Typography>
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
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Edit Jam'}
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

export default DrawerEditJam;
