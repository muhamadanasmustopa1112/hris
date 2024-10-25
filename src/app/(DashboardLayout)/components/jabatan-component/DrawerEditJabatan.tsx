import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from 'js-cookie';

interface DrawerEditJabatanProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jabatanId: number | null; 
}

const DrawerEditJabatan: React.FC<DrawerEditJabatanProps> = ({ open, onClose, onSuccess, jabatanId }) => {
  const [jabatanName, setJabatanName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  
  useEffect(() => {
    const fetchJabatanData = async () => {
      if (open && jabatanId) {
        try {
          const response = await axios.get(`https://backend-apps.ptspsi.co.id/api/jabatan/${jabatanId}`, {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            }
          });
          setJabatanName(response.data.data.name);
        } catch (error) {
          console.error('Gagal mengambil data jabatan:', error);
          setSnackbarMessage('Gagal mengambil data jabatan.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };

    fetchJabatanData();
  }, [open, jabatanId]);

  const handleEditDivision = async () => {
    if (jabatanName.trim() === '') {
      setSnackbarMessage('Nama divisi tidak boleh kosong.');
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
      const response = await axios.put(`https://backend-apps.ptspsi.co.id/api/jabatan/${jabatanId}`, {
          name: jabatanName,
        }, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        }
      );
      
      if (response.data.status === 'success') {
        setSnackbarMessage('Jabatan berhasil diperbarui!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setJabatanName(''); 
        onSuccess();
        onClose(); 
      }
    } catch (error) {
      setSnackbarMessage('Gagal memperbarui Jabatan.');
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
            <Typography variant="h6">Edit Jabatan</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Jabatan Name"
            variant="outlined"
            fullWidth
            value={jabatanName}
            onChange={(e) => setJabatanName(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleEditDivision}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Update Jabatan'}
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
            sx={{ width: '100%', color:'white' , backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
        >
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerEditJabatan;
