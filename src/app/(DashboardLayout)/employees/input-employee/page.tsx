'use client';
import React from 'react'; // Import React
import EmployeeInput from '../../components/employee-component/EmployeeInput';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import router from 'next/router';

const InputEmployeePage: React.FC = () => { 
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Karyawan</Typography>
        <Typography color="text.primary">Tambah Karyawan</Typography>
      </Breadcrumbs>
      
      <h1>Tambah Karyawan</h1>
      <EmployeeInput />
    </div>
  );
};

export default InputEmployeePage; 
