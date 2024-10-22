// DataEmployeePage.tsx
"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import TablePerizinan from '../../components/perizinan-component/TablePerizinan';
import router from 'next/router';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';


interface Perizinan {

    id: number;
    jenis_perizinan_id: number;
    category_id: number;
    companies_user_id: number;
    jenis_perizinan_name: string;
    category_name: string;
    company_user: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jam_masuk: string;
    jam_keluar: string;
    keterangan: string;
    status: string;
    lampiran: string;
    
  }

export default function DataEmployeePage() {
  const [perizinans, setPerizinans] = useState<Perizinan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);


  const fetchPerizinans = async () => {
    try {
      const response = await fetch('/api/get-perizinan');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPerizinans(data.data);

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
    fetchPerizinans();
  }, []);


  const handleChangePage = (event: unknown, newPage: number) => {
    console.log("New Page:", newPage); // Tambahkan log ini

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const totalPerizinans = perizinans.length;

  return (
    <PageContainer title="Manajemen Pengajuan Karyawan" description="Halaman untuk mengelola data pengajuan karyawan">
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
        <Typography color="text.primary">Cuti</Typography>
      </Breadcrumbs>
      <DashboardCard title="List Data Pengajuan Cuti/Izin">
      <Box>
        <TablePerizinan
          perizinans={{ length: totalPerizinans, data: perizinans  }}
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
