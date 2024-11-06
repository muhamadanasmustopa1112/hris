import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user')?.value;
    const tokenCookie = cookieStore.get('token')?.value;

    // Memeriksa apakah cookie user ada
    if (!userCookie || !tokenCookie) {
      return NextResponse.json({ message: 'User or token not found in cookies' }, { status: 400 });
    }

    const userObject = JSON.parse(userCookie);

    // Memeriksa apakah company_id ada dalam objek user
    if (!userObject?.company_id) {
      return NextResponse.json({ message: 'User or company_id not found' }, { status: 400 });
    }

    const apiUrl = `https://backend-apps.ptspsi.co.id/api/all-company-user/${userObject.company_id}`;

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

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error fetching data: ${response.statusText} - ${errorMessage}`);
    }

    const employees: Employee[] = await response.json();

    return NextResponse.json(employees);
  } catch (error) {
    // Memastikan error bertipe string
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in GET /api/get-employees:', errorMessage);
    return NextResponse.json({ message: 'Error fetching employees', error: errorMessage }, { status: 500 });
  }
}
