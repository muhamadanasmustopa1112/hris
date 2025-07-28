import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;      
  onProses: number;  
  success: number;   
  decline: number;   
}

interface BarChartsDashboardProps {
  data: ChartData[]; 
}

const BarChartsDashboard: React.FC<BarChartsDashboardProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="onProses" fill="#3498db" name="pending" />
        <Bar dataKey="success" fill="#52be80" name="approved" />
        <Bar dataKey="decline" fill="#e74c3c" name="rejected" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartsDashboard;
