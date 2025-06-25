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

interface DrawerInputDinasProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Employee {
  id: number;
  name: string;
}

const DrawerInputDinas: React.FC<DrawerInputDinasProps> = ({ open, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [companyUser, setCompanyUser] = useState('');
  const [tanggal_berangkat, setTanggalBerangkat] = useState('');
  const [tanggal_pulang, setTanggalPulang] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const roleName = user?.roles[0]?.name;
  const canEditAction = ['admin', 'Manager', 'HRD'].includes(roleName);

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString('base64');

  const resetForm = () => {
    setCompanyUser('');
    setTanggalBerangkat('');
    setTanggalPulang('');
    setTujuan('');
    setKeperluan('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSnackbarOpen(false);

    try {
      const response = await fetch('https://hris-api.ptspsi.co.id/api/perjalanan-dinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          company_id: user?.company_id,
          companies_users_id: canEditAction ? companyUser : user?.companies_users_id,
          tanggal_berangkat,
          tanggal_pulang,
          tujuan,
          keperluan,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Dinas berhasil ditambahkan!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onSuccess();
        resetForm();
        onClose();
      } else {
        const errorData = await response.json();
        const message =
          Object.values(errorData.message || {}).flat().join(', ') || 'Terjadi kesalahan saat mengirim data dinas';
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Terjadi error saat mengirim data dinas');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canEditAction) return;

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-employee');
        if (!response.ok) throw new Error('Gagal mengambil data karyawan');
        const data = await response.json();
        setEmployees(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [canEditAction]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Tambah Dinas</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {canEditAction && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-company-user-label">Nama Karyawan</InputLabel>
              <Select
                labelId="select-company-user-label"
                value={companyUser}
                label="Nama Karyawan"
                onChange={(e) => setCompanyUser(e.target.value)}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Keperluan"
            type="text"
            fullWidth
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            margin="normal"
            inputProps={{ min: 0 }}
          />
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
          sx={{
            width: '100%',
            color: 'white',
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawerInputDinas;
