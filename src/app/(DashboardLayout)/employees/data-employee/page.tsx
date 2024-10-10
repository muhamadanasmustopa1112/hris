// DataEmployeePage.tsx
"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import TableEmployee from '../../components/employee-component/TableEmployee';

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

export default function DataEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/get-employee');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEmployees(data.data); // Simpan data karyawan

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
    fetchEmployees();
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

  // Hitung total employees
  const totalEmployees = employees.length;

  // Ambil karyawan yang difilter untuk ditampilkan
  // const filteredEmployees = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Typography variant="h3" component="h3" gutterBottom>
        List Data Karyawan
      </Typography>
      
      <TableEmployee
        employees={{ length: totalEmployees, data: employees  }}
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
