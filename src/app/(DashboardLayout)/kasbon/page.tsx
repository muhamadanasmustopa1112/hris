"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import TableKasbon from '../components/kasbon-component/TableKasbon';

interface Kasbon {
    id: number;
    companies_users_id: number;
    company_user: string;
    tanggal: string;
    nominal: number;
    tenor: number;
    keterangan: string;
    status: string;
  }
  

export default function DataKasbonPage() {
  const [kasbons, setKasbons] = useState<Kasbon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const router = useRouter();

  const fetchKasbons = async () => {

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
        alert("DATA NOT FOUND!");
      return;
    }
    
    try {
      
      const response = await axios.get('https://backend-apps.ptspsi.co.id/api/kasbon', {
        params: {
          company_id: user.company_id,
        },
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        }
      });

      if (Array.isArray(response.data.data)) {
        setKasbons(response.data.data);
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
    fetchKasbons();
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

  const totalKasbons = kasbons.length;

  return (
    <PageContainer title="Manajemen Pengajuan Karyawan" description="Halaman untuk mengelola data pengajuan lembur karyawan">
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Pengajuan</Typography>
        <Typography color="text.primary">Kasbon</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Data Pengajuan Kasbon">
        <Box>
          <TableKasbon
            kasbons={{ length: totalKasbons, data: kasbons }}
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
