"use client";
import { Box, CircularProgress, Grid } from '@mui/material';
import PageContainer from './components/container/PageContainer';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import BarChartsDashboard from './components/dashboard/BarChartsDashboard';
import axios from 'axios';

interface Izin {
  totalOnProsses: number;
  totalSuccess: number;
  totalDecline: number;
}

interface Lembur {
  totalOnProsses: number;
  totalSuccess: number;
  totalDecline: number;
}

interface Kasbon {
  totalOnProsses: number;
  totalSuccess: number;
  totalDecline: number;
}


const Dashboard = () => {
  const [izin, setIzin] = useState<Izin | null>(null);
  const [lembur, setLembur] = useState<Lembur | null>(null);
  const [kasbon, setKasbon] = useState<Kasbon | null>(null);
  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (user?.roles[0]?.name !== "admin") {
      router.replace('/404');
    }
  }, [router]);

  const fetchDivisions = useCallback(async () => {
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
      alert("DATA NOT FOUND!");
      return;
    }

    try {
      const response = await axios.get(`https://backend-apps.ptspsi.co.id/api/dashboard/${user.company_id}`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      
      setIzin(response.data.perizinan);
      setLembur(response.data.lembur);
      setKasbon(response.data.kasbon);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [basicAuth]);
  
  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  const chartData = [
     { name: 'Izin', onProses: izin?.totalOnProsses || 0, success: izin?.totalSuccess || 0, decline: izin?.totalDecline || 0 },
    { name: 'Lembur', onProses: lembur?.totalOnProsses || 0, success: lembur?.totalSuccess || 0, decline: lembur?.totalDecline || 0 },
    { name: 'Kasbon', onProses: kasbon?.totalOnProsses || 0, success: kasbon?.totalSuccess || 0, decline: kasbon?.totalDecline || 0 },
  ];

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BarChartsDashboard data={chartData} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
