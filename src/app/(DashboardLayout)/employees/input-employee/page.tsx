'use client';
import React, { useEffect } from 'react';
import EmployeeInput from '../../components/employee-component/EmployeeInput';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const InputEmployeePage: React.FC = () => { 
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;
  
    if (user?.roles[0]?.name !== "admin") {
      router.replace('/404');
    }
  }, [router]);
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
