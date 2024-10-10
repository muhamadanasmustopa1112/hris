// DataEmployeePage.tsx
"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import TablePerizinan from '../../components/perizinan-component/TablePerizinan';

interface Employee {
  id: number;
  nik: string;
  name: string;
  jabatan: string;
  no_hp: string;
  email: string;
  qr_code: string;
  ktp_karyawan: string;
}

interface Perizinan {

    id: number;
    jenis_perizinan_id: number;
    category_id: number;
    jenis_perizinan_name: string;
    category_name: string;
    companies_user: string;
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

  // Ambil karyawan yang difilter untuk ditampilkan
//   const filteredPerizinans = perizinans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Typography variant="h3" component="h3" gutterBottom>
        List Data Perizinan
      </Typography>
      
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
  );
}
