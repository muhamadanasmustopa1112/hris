"use client";

import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import TablePresensi from '../components/presensi-component/TablePresensi';

interface Presensi {
  
  id: number;
  companies_user_id: number;
  presensi_keluar_id: number;
  shift_name: string;
  companies_user: string;
  tanggal: string;
  status_masuk: string;
  status_keluar: string;
  jam_masuk: string;
  jam_keluar: string;
  keterangan_masuk: string;
  keterangan_keluar: string;
  alamat: string;
  
}
export default function DataPresensiPage() {
  const [presensis, setPresensis] = useState<Presensi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (user?.roles[0]?.name !== "admin") {
      router.replace('/404');
    }
  }, [router]);
  
  const fetchPresensis = useCallback(async () => {

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user || !user.company_id) {
        alert("DATA NOT FOUND!");
      return;
    }
    
    try {
      
      const response = await axios.get('https://hris-api.ptspsi.co.id/api/presensi', {
        params: {
          company_id: user.company_id,
        },
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      let allPresensis: any[] = [];    
      response.data.data.forEach((entry: any) => {
        
        if (Array.isArray(entry.data)) {
          
          entry.data.forEach((item: any) => {
            
            if (item.presensi) {
              allPresensis.push(item.presensi); 
            }
          });
        }
      });
      setPresensis(allPresensis);
      if (allPresensis.length === 0) {
        console.error('No presensi data found.');
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
    fetchPresensis();
  }, [fetchPresensis]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const totalPresensi = presensis.length;

  return (
    <PageContainer title="Manajemen Presensi Karyawan" description="Halaman untuk mengelola data Presennsi karyawan">
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Presensi</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Data Presensi Karyawan">
        <Box>
          <TablePresensi
            presensis={{ length: totalPresensi, data: presensis }}
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
