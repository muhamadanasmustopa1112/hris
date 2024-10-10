'use client';

import React from 'react';

// Fungsi server-side fetch langsung dalam komponen, tanpa cache
async function getEmployees() {
  const res = await fetch('http://127.0.0.1:8000/api/company-user', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }

  return res.json();
}

export default async function EmployeePage() {
  const employees = await getEmployees();

  return (
    <div>
      <h1>Employee List</h1>
      <ul>
        {employees.data.map((employee: any) => (
          <li key={employee.nik}>
            {employee.qr_code} - {employee.jabatan}
          </li>
        ))}
      </ul>
    </div>
  );
}