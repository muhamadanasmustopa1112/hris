"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Breadcrumbs, Link, Divider } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import ChangePasswordForm from '../components/profile-component/ChangePasswordForm';
import DataUser from '../components/profile-component/DataUser';
import DataAdmin from '../components/profile-component/DataAdmin';

export default function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [employeeData, setEmployeeData] = useState(null);
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const router = useRouter();

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  useEffect(() => {
    if (!user) {
      alert("User data not found!");
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (user && !employeeData) {
      const fetchEmployeeDetails = async () => {
        try {

          const endpoint = user.roles[0].name === 'admin' 
          ? `https://backend-apps.ptspsi.co.id/api/company-detail/${user.company_id}`
          : `https://backend-apps.ptspsi.co.id/api/company-user/${user.companies_users_id}`; 

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setEmployeeData(data);
        } catch (error) {
          console.error('Error fetching employee details:', error);
        }
      };

      fetchEmployeeDetails();
    }
  }, [basicAuth, user]);

  if (loading) return <CircularProgress />;

  return (
    <PageContainer title="Profile" description="Halaman Profil Karyawan">
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '50px' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Profile</Typography>
      </Breadcrumbs>
      
      <DashboardCard>
        <Box sx={{ padding: '20px' }}>
          {user.roles[0].name === 'admin' ? (
            <DataAdmin user={user} employeeData={employeeData} />
          ) : (
            <DataUser user={user} employeeData={employeeData} />
          )}
          <Divider sx={{ marginY: 2 }} />
          <ChangePasswordForm userId={user?.id} />
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
