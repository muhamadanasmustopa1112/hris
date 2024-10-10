'use client';
import React from 'react'; // Import React
import EditEmployee from '@/app/(DashboardLayout)/components/employee-component/EditEmployee';

const EditEmployeePage: React.FC = () => { // Correctly define the component
  return (
    <div>
      <h1>Edit Karyawan</h1>
      <EditEmployee />
    </div>
  );
};

export default EditEmployeePage;
