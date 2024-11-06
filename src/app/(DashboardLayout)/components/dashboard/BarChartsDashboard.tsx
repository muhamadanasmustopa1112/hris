import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;      // Change the type if necessary
  onProses: number;  // Assuming it's a number
  success: number;   // Assuming it's a number
  decline: number;   // Assuming it's a number
}

interface BarChartsDashboardProps {
  data: ChartData[]; // Array of ChartData
}

const BarChartsDashboard: React.FC<BarChartsDashboardProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="onProses" fill="#3498db" name="On Proses" />
        <Bar dataKey="success" fill="#52be80" name="Success" />
        <Bar dataKey="decline" fill="#e74c3c" name="Decline" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartsDashboard;
