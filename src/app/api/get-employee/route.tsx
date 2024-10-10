import { NextResponse } from 'next/server';

interface Employee {
  id: number;
  nik: string;
  name: string;
  jabatan: string;
  no_hp: string;
  email: string;
  qr: string;
}

export async function GET() {
  try {
    // URL API Laravel
    const apiUrl = 'http://127.0.0.1:8000/api/company-user'; // Ganti dengan URL API Laravel Anda
    
    // Mengambil data dari API Laravel
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
    });

    // Cek jika respons dari API Laravel OK
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const employees: Employee[] = await response.json();

    // Kirimkan data pegawai ke client
    return NextResponse.json(employees); // Mengembalikan data pegawai
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching employees' }, { status: 500 });
  }
}
