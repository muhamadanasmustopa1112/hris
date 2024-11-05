import React, { useState } from 'react';
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

interface DrawerInputDivisionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DrawerInputJabatan: React.FC<DrawerInputDivisionProps> = ({ open, onClose, onSuccess }) => {
  const [jabatanName, setJabatanName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  const handleAddDivision = async () => {
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

      const response = await axios.post('https://backend-apps.ptspsi.co.id/api/jabatan', {
          name: jabatanName,
          company_id: user.company_id,
        }, {
          headers: {
            'Authorization': `Basic ${basicAuth}`
          }
        }
      );

      if (response.data.message === 'success') {
        setSnackbarMessage('Jabatan berhasil ditambahkan!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setJabatanName(''); 
        onSuccess();
        onClose(); 
      }
    } catch (error) {
      setSnackbarMessage('Gagal menambahkan Jabatan.');
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
            <Typography variant="h6">Add Jabatan</Typography>
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
            onClick={handleAddDivision}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Add Jabatan'}
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
            sx={{ width: '100%',color: 'white', backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
        >
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerInputJabatan;
