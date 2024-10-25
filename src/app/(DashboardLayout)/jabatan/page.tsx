"use client";
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TableJabatan from '../components/jabatan-component/TableJabatan';
import Cookies from 'js-cookie';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';

interface Jabatan {
  id: number;
  name: string;
  company_id: number;
}

export default function JabatanPage() {
  const [jabatans, setJabatans] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const router = useRouter();

  const fetchJabatans = async () => {
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
      alert("DATA NOT FOUND!");
      return;
    }

    try {
      const response = await axios.get('https://backend-apps.ptspsi.co.id/api/jabatan', {
        params: {
          company_id: user.company_id,
        },
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        }
      });

      if (Array.isArray(response.data.data)) {
        setJabatans(response.data.data);
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
    fetchJabatans();
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

  const totalJabatan = jabatans.length;

  return (
    <PageContainer title="Manajemen Jabatan" description="Halaman untuk mengelola data jabatan">
       <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Jabatan</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Data Jabatan">
        <Box>
          <TableJabatan
            jabatans={{ length: totalJabatan, data: jabatans }}
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
