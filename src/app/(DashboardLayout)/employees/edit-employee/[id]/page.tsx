'use client';
import React, { useEffect } from 'react'; // Import React
import EditEmployee from '@/app/(DashboardLayout)/components/employee-component/EditEmployee';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const EditEmployeePage: React.FC = () => {
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
        <Typography color="text.primary">Edit Karyawan</Typography>
      </Breadcrumbs>
      <h1>Edit Karyawan</h1>
      <EditEmployee />
    </div>
  );
};

export default EditEmployeePage;
