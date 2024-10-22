"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import TableJam from '../components/jam-component/TableJam';

interface Jam {
    id: number;
    shift_id: number;
    shift_name: string;
    jam_masuk: string;
    jam_keluar: string;
}
  

export default function DataJamPage() {
  const [jams, setJams] = useState<Jam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const router = useRouter();

  const fetchJams = async () => {

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
        alert("DATA NOT FOUND!");
      return;
    }
    
    try {
      
      const response = await axios.get('http://127.0.0.1:8000/api/jam', {
        params: {
          company_id: user.company_id,
        },
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        }
      });

      if (Array.isArray(response.data.data)) {
        setJams(response.data.data);
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
    fetchJams();
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

  const totalJams = jams.length;

  return (
    <PageContainer title="Manajemen Master Data Jam" description="Halaman untuk mengelola data jam karyawan">
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Jam</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Master Data Jam">
        <Box>
          <TableJam
            jams={{ length: totalJams, data: jams }}
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
