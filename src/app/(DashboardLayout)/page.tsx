"use client";
import { Box, Grid } from '@mui/material';
import PageContainer from './components/container/PageContainer';
import TotalKaryawan from './components/dashboard/TotalKaryawan';
import TotalPerizinan from './components/dashboard/TotalPerizinan';
import TotalAbsensi from './components/dashboard/TotalAbsensi';



const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <TotalKaryawan />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TotalPerizinan />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TotalAbsensi />
            </Grid>
          </Grid>
        </Box>
    </PageContainer>
  );
};

export default Dashboard;
