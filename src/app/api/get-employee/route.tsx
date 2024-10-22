import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

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
    const TokenCookie = cookieStore.get('token')?.value;

    if (!userCookie) {
      return NextResponse.json({ message: 'No user found in cookies' }, { status: 400 });
    }

    const userObject = JSON.parse(userCookie);

    
    if (!userObject?.company_id) {
      return NextResponse.json({ message: 'User or company_id not found' }, { status: 400 });
    }

    const apiUrl = `http://127.0.0.1:8000/api/all-company-user/${userObject.company_id}`;

    const response = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TokenCookie}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const employees: Employee[] = await response.json();

    
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching employees' }, { status: 500 });
  }
}
