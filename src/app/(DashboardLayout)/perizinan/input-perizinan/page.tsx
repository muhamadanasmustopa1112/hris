'use client';
import React from 'react'; // Import React
import PerizinanInput from '../../components/perizinan-component/PerizinanInput';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import router from 'next/router';

const InputPerizinanPage: React.FC = () => { // Correctly define the component
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
        <Typography color="text.primary">Pengajuan</Typography>
      </Breadcrumbs>
      <h1>Tambah Perizinan</h1>
      <PerizinanInput />
    </div>
  );
};

export default InputPerizinanPage;
