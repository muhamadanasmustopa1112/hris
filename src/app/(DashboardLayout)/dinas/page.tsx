"use client";

import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import TableDinas from '../components/dinas-component/TableDinas';

interface Dinas {
    id: number;
    companies_users_id: number;
    company_user: string;
    tanggal: string;
    nominal: number;
    tenor: number;
    keterangan: string;
    status: string;
  }
  

export default function DataDinasPage() {
  const [Dinass, setDinass] = useState<Dinas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const router = useRouter();
  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  const fetchDinass = useCallback(async () => {

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
        alert("DATA NOT FOUND!");
      return;
    }
    
    try {
      
      const endpoint = user?.roles[0].name === "admin"
      ? 'https://hris-api.ptspsi.co.id/api/perjalanan-dinas'
      : `https://hris-api.ptspsi.co.id/api/perjalanan-dinas-user/${user?.companies_users_id}`;

      const response = await axios.get(endpoint, {
        params: user?.roles[0].name === "admin"
        ? { company_id: user.company_id }
        : {},
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });

      if (Array.isArray(response.data.data)) {
        setDinass(response.data.data);
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
  }, [basicAuth]);

  useEffect(() => {
    fetchDinass();
  }, [fetchDinass]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const totalDinass = Dinass.length;

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
        <Typography color="text.primary">Dinas</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Data Pengajuan Dinas">
        <Box>
          <TableDinas
            Dinass={{ length: totalDinass, data: Dinass }}
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
