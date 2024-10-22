'use client';
import React from 'react'; // Import React
import EditEmployee from '@/app/(DashboardLayout)/components/employee-component/EditEmployee';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import router from 'next/router';

const EditEmployeePage: React.FC = () => { // Correctly define the component
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
        <Typography color="text.primary">Edit Karyawan</Typography>
      </Breadcrumbs>
      <h1>Edit Karyawan</h1>
      <EditEmployee />
    </div>
  );
};

export default EditEmployeePage;
