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

interface DrawerEditShiftProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shiftId: number | null; 

}

const DrawerEditShift: React.FC<DrawerEditShiftProps> = ({ open, onClose, onSuccess, shiftId }) => {
  const [shiftName, setShiftName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  useEffect(() => {
    const fetchShiftData = async () => {
      if (open && shiftId) {
        try {
          const response = await axios.get(`https://hris-api.ptspsi.co.id/api/shift/${shiftId}`, {
            headers: {
              'Authorization': `Basic ${basicAuth}`
            }
          });
          setShiftName(response.data.data.name);
          setStatus(response.data.data.status);
        } catch (error) {
          console.error('Gagal mengambil data shift:', error);
          setSnackbarMessage('Gagal mengambil data shift.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };

    fetchShiftData();
  }, [open, shiftId, basicAuth]);
  

  const handleEdiShift = async () => {
    if (shiftName.trim() === '') {
      setSnackbarMessage('Nama shift tidak boleh kosong.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

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
      const response = await axios.put(`https://hris-api.ptspsi.co.id/api/shift/${shiftId}`, {
          name: shiftName,
          status: status,
        }, {
          headers: {
            'Authorization': `Basic ${basicAuth}`
          }
        }
      );
      
      if (response.data.status === 'success') {
        setSnackbarMessage('Shift berhasil diperbarui!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setShiftName(''); 
        setStatus(''); 
        onSuccess();
        onClose(); 
      }
    } catch (error) {
      setSnackbarMessage('Gagal memperbarui shift.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

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
            <Typography variant="h6">Edit Shift</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Shift Name"
            variant="outlined"
            fullWidth
            value={shiftName}
            onChange={(e) => setShiftName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-status-label">Status</InputLabel>
            <Select
              labelId="select-status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Non Active">Non Active</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdiShift}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Edit Shift'}
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

export default DrawerEditShift;
