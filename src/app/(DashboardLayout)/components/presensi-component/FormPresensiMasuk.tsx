import React, { useEffect, useState } from 'react';
import {
    TextField,
    MenuItem,
    Grid,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';


interface Employee {
    id: number;
    name: string;
}

interface Shift {
    id: number;
    name: string;
}

interface FormPresensiMasukProps {
    shiftId: string;
    setShiftId: (value: string) => void;
    companiesUsersId: string;
    setCompaniesUsersId: (value: string) => void;
    tanggal: string;
    setTanggal: (value: string) => void;
    jam: string;
    setJam: (value: string) => void;
    latitude: string;
    setLatitude: (value: string) => void;
    longitude: string;
    setLongitude: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    keterangan: string;
    setKeterangan: (value: string) => void;
}

const FormPresensiMasuk: React.FC<FormPresensiMasukProps> = ({
    shiftId,
    setShiftId,
    companiesUsersId,
    setCompaniesUsersId,
    tanggal,
    setTanggal,
    jam,
    setJam,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    status,
    setStatus,
    keterangan,
    setKeterangan,
}) => {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  
    const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

    useEffect(() => {
        const fetchEmployees = async () => {
          setLoading(true);
          try {
            const response = await fetch('/api/get-employee', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployees(data.data);
          } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError('An unknown error occurred');
            }
          } finally {
            setLoading(false);
          }
        };
        fetchEmployees();
    }, [basicAuth]);

    useEffect(() => {
        const fetchShifts = async () => {
    
            setLoading(true);
            const userCookie = Cookies.get('user');
            const user = userCookie ? JSON.parse(userCookie) : null;
    
            if (!user || !user.company_id) {
                alert("DATA NOT FOUND!");
            return;
            }
            
            try {
            
            const response = await axios.get('https://backend-apps.ptspsi.co.id/api/shift-active', {
                params: {
                    company_id: user.company_id,
                },
                headers: {
                    'Authorization': `Basic ${basicAuth}`
                }
            });
    
            if (Array.isArray(response.data.data)) {
                setShifts(response.data.data);
            } else {
                console.error('Expected an array, but got:', typeof response.data);
            }
            } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            } finally {
            setLoading(false);
            }
        };
        fetchShifts();
    }, [basicAuth]);


    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="select-company-user-label">Shift Name</InputLabel>
                    <Select
                    labelId="select-company-user-label"
                    value={shiftId}
                    label="Shift Name"
                    onChange={(e) => setShiftId(e.target.value)}
                    >
                    {shifts.map((shift) => (
                        <MenuItem key={shift.id} value={shift.id}>
                        {shift.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="select-company-user-label">Companies Users</InputLabel>
                    <Select
                    labelId="select-company-user-label"
                    value={companiesUsersId}
                    label="Companies Users"
                    onChange={(e) => setCompaniesUsersId(e.target.value)}
                    >
                    {employees.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                        {user.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Tanggal"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Jam Masuk"
                    type="time"
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }} 
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    fullWidth
                    disabled
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    fullWidth
                    disabled
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="select-status-label">Status</InputLabel>
                    <Select
                    labelId="select-status-label"
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Tepat Waktu">Tepat Waktu</MenuItem>
                        <MenuItem value="Terlambat">Terlambat</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Keterangan"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                />
            </Grid>
        </Grid>
    );
};

export default FormPresensiMasuk;
