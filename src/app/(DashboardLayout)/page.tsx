"use client";
import { Box, Grid } from '@mui/material';
import PageContainer from './components/container/PageContainer';
import TotalKaryawan from './components/dashboard/TotalKaryawan';
import TotalPerizinan from './components/dashboard/TotalPerizinan';
import TotalAbsensi from './components/dashboard/TotalAbsensi';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';



const Dashboard = () => {

  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (user?.roles[0]?.name !== "admin") {
      router.replace('/404');
    }
  }, [router]);

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
