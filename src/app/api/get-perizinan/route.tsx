import { NextResponse } from 'next/server';

interface Perizinan {

  id: number;
  jenis_perizinan_id: number;
  category_id: number;
  jenis_perizinan_name: string;
  category_name: string;
  companies_user: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_masuk: string;
  jam_keluar: string;
  keterangan: string;
  status: string;
  lampiran: string;
  
}

export async function GET() {
  try {
   
    const apiUrl = 'http://127.0.0.1:8000/api/perizinan'; 

    const response = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const perizinans: Perizinan[] = await response.json();

    return NextResponse.json(perizinans);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching employees' }, { status: 500 });
  }
}
