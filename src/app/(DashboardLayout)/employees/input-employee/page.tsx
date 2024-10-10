'use client';
import React from 'react'; // Import React
import EmployeeInput from '../../components/employee-component/EmployeeInput';

const InputEmployeePage: React.FC = () => { // Correctly define the component
  return (
    <div>
      <h1>Tambah Karyawan</h1>
      <EmployeeInput />
    </div>
  );
};

export default InputEmployeePage; // Export the component
