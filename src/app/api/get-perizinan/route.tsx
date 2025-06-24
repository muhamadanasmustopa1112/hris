import { cookies } from 'next/headers';
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
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user')?.value;
    const tokenCookie = cookieStore.get('token')?.value;

    // Cek apakah cookie user dan token tersedia
    if (!userCookie || !tokenCookie) {
      return NextResponse.json({ message: 'User or token not found in cookies' }, { status: 400 });
    }

    const userObject = JSON.parse(userCookie);

    // Cek apakah company_id ada dalam objek user
    if (!userObject?.company_id) {
      return NextResponse.json({ message: 'User or company_id not found' }, { status: 400 });
    }
    
    const apiUrl = userObject?.roles[0].name === "admin"
    ? `https://hris-api.ptspsi.co.id/api/perizinan?company_id=${userObject.company_id}`
    : `https://hris-api.ptspsi.co.id/api/perizinan-user/${userObject?.companies_users_id}`;

    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

    const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");


    const response = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
    });
    
    // Menangani respons dari API
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error fetching data: ${response.status} - ${response.statusText}: ${errorMessage}`);
      return NextResponse.json({ message: 'Failed to fetch data', error: errorMessage }, { status: response.status });
    }

    // Memeriksa apakah respons kosong
    const perizinans: Perizinan[] = await response.json();
    if (perizinans.length === 0) {
      return NextResponse.json({ message: 'No perizinan data found' }, { status: 404 });
    }

    return NextResponse.json(perizinans);

  } catch (error) {
    console.error('Error in GET /api/get-perizinan:', error);
    return NextResponse.json({ message: 'Error fetching perizinan', error: String(error) }, { status: 500 });
  }
}
