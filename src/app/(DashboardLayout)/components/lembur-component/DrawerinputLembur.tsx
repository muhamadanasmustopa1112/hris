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
import Cookies from 'js-cookie';

interface DrawerInputLemburProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Employee {
  id: number;
  name: string;
}

const DrawerInputLembur: React.FC<DrawerInputLemburProps> = ({ open, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [companyUser, setCompanyUser] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSubmit = async () => {
    setLoading(true);
    setSnackbarOpen(false);
    try {
      const response = await fetch('https://backend-apps.ptspsi.co.id/api/lembur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          companies_users_id: companyUser,
          tanggal: tanggal,
          jam: jam,
          description: description,
          status: status,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Lembur berhasil ditambahkan!');
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

      }
    } catch (error) {
        setSnackbarMessage('An error occurred while adding the lembur');
        setSnackbarSeverity('error');
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
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Tambah Lembur</Typography>
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
            label="Jam"
            type="time"
            fullWidth
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Keterangan"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default DrawerInputLembur;
