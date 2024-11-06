import { useState } from 'react';
import { Box, TextField, Button, Alert, CircularProgress, Typography, Snackbar } from '@mui/material';
import axios from 'axios';

interface ChangePasswordFormProps {
  userId: number;
}

export default function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordOld, setPasswordOld] = useState<string>('');
  const [passwordNew, setPasswordNew] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  const handlePasswordChange = async () => {
    if (passwordNew !== passwordConfirm) {
      setSnackbarMessage("Password baru dan konfirmasi password tidak sama.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await axios.post('https://backend-apps.ptspsi.co.id/api/change-password', {
            id: userId,
            old_password: passwordOld,
            password: passwordNew,
            password_confirmation: passwordConfirm,
        }, {
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            }
        }
      );
      console.log(response.data);
      if (response.data.message === "Password berhasil diperbarui" ) {
        setSnackbarMessage("Password berhasil diubah.");
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage("Gagal mengubah password.");
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage("Terjadi kesalahan, silakan coba lagi.");
      setSnackbarSeverity('error');
    } finally {
      setPasswordLoading(false);
      setPasswordOld('');
      setPasswordNew('');
      setPasswordConfirm('');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>Ganti Password</Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Password Lama"
          type="password"
          value={passwordOld}
          onChange={(e) => setPasswordOld(e.target.value)}
          fullWidth
          autoComplete="current-password"
        />
        <TextField
          label="Password Baru"
          type="password"
          value={passwordNew}
          onChange={(e) => setPasswordNew(e.target.value)}
          fullWidth
          autoComplete="new-password"
        />
        <TextField
          label="Konfirmasi Password Baru"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          fullWidth
          autoComplete="new-password"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordChange}
          disabled={passwordLoading}
        >
          {passwordLoading ? <CircularProgress size={24} /> : "Ganti Password"}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
            color: 'white',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
