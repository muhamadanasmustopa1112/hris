import { Box, Typography, Grid, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';

interface UserInfoProps {
  user: any;
  employeeData: any;
}

export default function DataUser({ user, employeeData }: UserInfoProps) {
  const name = employeeData?.data.name;
  const email = employeeData?.data.email;
  const companyName = employeeData?.data.company;
  const jabatan = employeeData?.data.jabatan;
  const role = user?.roles?.[0]?.name;

  return (
    <Paper elevation={3} sx={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom align="center" color="primary" sx={{ marginBottom: 2 }}>
        Profil Pengguna
      </Typography>
      
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <AccountCircleIcon color="primary" />
            <Typography variant="subtitle1" color="textSecondary">Nama:</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{name}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <EmailIcon color="primary" />
            <Typography variant="subtitle1" color="textSecondary">Email:</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{email}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <BusinessIcon color="primary" />
            <Typography variant="subtitle1" color="textSecondary">Perusahaan:</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{companyName}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <WorkIcon color="primary" />
            <Typography variant="subtitle1" color="textSecondary">Position:</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{jabatan}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <SecurityIcon color="primary" />
            <Typography variant="subtitle1" color="textSecondary">Role:</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{role}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
