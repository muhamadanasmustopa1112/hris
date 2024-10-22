'use client';
import React from 'react';
import PerizinanEdit from '../../../components/perizinan-component/PerizinanEdit';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import router from 'next/router';

const EditPerizinan: React.FC = () => {
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
      <h1>Edit Perizinan</h1>
      <PerizinanEdit />
    </div>
  );
};

export default EditPerizinan;
