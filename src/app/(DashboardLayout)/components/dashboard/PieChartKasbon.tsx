import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieChartKasbon() {
  return (
    <PieChart
    colors={['#cb4335', '#3498db', '#52be80']}
    series={[
        {
            data: [
                { id: 0, value: 10, label: 'rejected'}, 
                { id: 1, value: 15, label: 'pending'},    
                { id: 2, value: 20, label: 'approved'}, 
            ],
        },
    ]}
    width={400}
    height={200}
    />
  );
}
