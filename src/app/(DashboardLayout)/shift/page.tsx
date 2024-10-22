"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardCard from '../components/shared/DashboardCard';
import PageContainer from '../components/container/PageContainer';
import TableShift from '../components/shift-component/TableShift';

interface Shift {
  id: number;
  name: string;
  status: string;
  company_id: number;
}

export default function DataShiftPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const router = useRouter();

  const fetchShifts = async () => {

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
        alert("DATA NOT FOUND!");
      return;
    }
    
    try {
      
      const response = await axios.get('http://127.0.0.1:8000/api/shift', {
        params: {
          company_id: user.company_id,
        },
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        }
      });

      if (Array.isArray(response.data.data)) {
        setShifts(response.data.data);
      } else {
        console.error('Expected an array, but got:', typeof response.data);
      }
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

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const totalShift = shifts.length;

  return (
    <PageContainer title="Manajemen Shift" description="Halaman untuk mengelola data shift jam kerja perusahaan">
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Shift</Typography>
      </Breadcrumbs>  
      <DashboardCard title="List Data Shift">
      <Box>      
        <TableShift
          shifts={{ length: totalShift, data: shifts }}
          loading={loading}
          error={error}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Box>
      </DashboardCard>
    </PageContainer>
  );
}
