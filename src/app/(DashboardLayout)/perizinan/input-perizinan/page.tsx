'use client';
import React from 'react'; // Import React
import PerizinanInput from '../../components/perizinan-component/PerizinanInput';

const InpuPerizinanPage: React.FC = () => { // Correctly define the component
  return (
    <div>
      <h1>Tambah Perizinan</h1>
      <PerizinanInput />
    </div>
  );
};

export default InpuPerizinanPage;
