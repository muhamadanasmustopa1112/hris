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

const DrawerInputDivision: React.FC<DrawerInputDivisionProps> = ({ open, onClose, onSuccess }) => {
  const [divisionName, setDivisionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleAddDivision = async () => {
    if (divisionName.trim() === '') {
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

      const response = await axios.post('https://backend-apps.ptspsi.co.id/api/division', {
          name: divisionName,
          company_id: user.company_id,
        }, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        }
      );

      if (response.data.message === 'success') {
        setSnackbarMessage('Divisi berhasil ditambahkan!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setDivisionName(''); 
        onSuccess();
        onClose(); 
      }
    } catch (error) {
      setSnackbarMessage('Gagal menambahkan divisi.');
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
            <Typography variant="h6">Add Division</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Division Name"
            variant="outlined"
            fullWidth
            value={divisionName}
            onChange={(e) => setDivisionName(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDivision}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Add Division'}
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

export default DrawerInputDivision;
