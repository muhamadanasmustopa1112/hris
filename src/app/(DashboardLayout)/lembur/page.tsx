"use client";

import { useCallback, useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import TableLembur from '../components/lembur-component/TableLembur';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';

interface Lembur {
    id: number;
    companies_users_id: number;
    company_user: string;
    tanggal: string;
    jam: string;
    description: string;
    status: string;
}

export default function DataLemburPage() {
  const [lemburs, setLemburs] = useState<Lembur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const router = useRouter();

  const basicAuth = useMemo(() => {
    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
    return Buffer.from(`${username_api}:${password_api}`).toString("base64");
  }, [process.env.NEXT_PUBLIC_API_USERNAME, process.env.NEXT_PUBLIC_API_PASSWORD]);

  const fetchLemburs = useCallback(async () => {
    if (!user || !user.company_id || dataFetched) {
      return;
    }

    try {
      const endpoint = user?.roles[0].name === "admin"
        ? 'https://hris-api.ptspsi.co.id/api/lembur'
        : `https://hris-api.ptspsi.co.id/api/lembur-user/${user?.companies_users_id}`;

      const response = await axios.get(endpoint, {
        params: user?.roles[0].name === "admin"
          ? { company_id: user.company_id }
          : {},
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });

      if (Array.isArray(response.data.data)) {
        setLemburs(response.data.data);
        setDataFetched(true);
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
  }, [basicAuth, user, dataFetched]);

  useEffect(() => {
    if (user && user.company_id && !dataFetched) {
      fetchLemburs();
    }
  }, [fetchLemburs, user, dataFetched]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const totalLemburs = lemburs.length;

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
        <Typography color="text.primary">Lembur</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Data Pengajuan Lembur">
        <Box>
          <TableLembur
            lemburs={{ length: totalLemburs, data: lemburs }}
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
