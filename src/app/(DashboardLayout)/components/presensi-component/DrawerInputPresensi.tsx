// components/DrawerInputPresensi.tsx

import React, { useEffect, useState } from 'react';
import {
    Drawer,
    Button,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import FormPresensiMasuk from './FormPresensiMasuk';
import FormPresensiKeluar from './FormPresensiKeluar';
import axios from 'axios';
import Cookies from 'js-cookie';

interface DrawerInputPresensiProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;

}

const DrawerInputPresensi: React.FC<DrawerInputPresensiProps> = ({ open, onClose, onSuccess }) => {
    const [shiftId, setShiftId] = useState('');
    const [companiesUsersId, setCompaniesUsersId] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jam, setJam] = useState('');
    const [jamKeluar, setJamKeluar] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [status, setStatus] = useState('');
    const [statusKeluar, setStatusKeluar] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [keteranganKeluar, setKeteranganKeluar] = useState('');

    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
    const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

    // Fungsi untuk mendapatkan geolocation
    const getGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                },
                (error) => {
                    console.error("Geolocation error: ", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
        }
    };

    useEffect(() => {
        getGeolocation();
    }, [basicAuth]);

    const handleSubmit = async () => {

        setLoading(true);

        if (!latitude || !longitude) {
            console.error("Geolocation belum tersedia!");
        }

        const dataMasuk = {
            shift_id: shiftId,
            companies_users_id: companiesUsersId,
            tanggal:tanggal,
            jam:jam,
            latitude:latitude,
            longtitude:longitude,
            status:status,
            keterangan:keterangan,
        };

        const dataKeluar = {
            shift_id: shiftId,
            companies_users_id: companiesUsersId,
            tanggal:tanggal,
            jam:jamKeluar,
            latitude:latitude,
            longtitude:longitude,
            status:statusKeluar,
            keterangan:keteranganKeluar,
        };

        try {
            const response_masuk = await axios.post('https://hris-api.ptspsi.co.id/api/presensi-masuk', dataMasuk, {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                }
            });
            const response_keluar = await axios.post('https://hris-api.ptspsi.co.id/api/presensi-keluar', dataKeluar, {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                }
            });
    
            setSnackbarMessage('Presensi berhasil disimpan');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onSuccess();

        } catch (error) {
            console.error("Error submitting data to API:", error);
            console.error("Error submitting data to API:", error);

            setSnackbarMessage('Gagal mengirim presensi' + error);
            setSnackbarSeverity('error');
            // onClose();
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Drawer anchor="bottom" open={open} onClose={onClose}>
            <Box sx={{ padding: 3, width: '100%', maxWidth: 1000, margin: '0 auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Input Presensi Masuk
                                </Typography>
                                <Button color="inherit" onClick={onClose}>Close</Button>
                            </Toolbar>
                        </AppBar>
                        <FormPresensiMasuk
                            shiftId={shiftId}
                            setShiftId={setShiftId}
                            companiesUsersId={companiesUsersId}
                            setCompaniesUsersId={setCompaniesUsersId}
                            tanggal={tanggal}
                            setTanggal={setTanggal}
                            jam={jam}
                            setJam={setJam}
                            latitude={latitude}
                            setLatitude={setLatitude}
                            longitude={longitude}
                            setLongitude={setLongitude}
                            status={status}
                            setStatus={setStatus}
                            keterangan={keterangan}
                            setKeterangan={setKeterangan}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Input Presensi Keluar
                                </Typography>
                                <Button color="inherit" onClick={onClose}>Close</Button>
                            </Toolbar>
                        </AppBar>
                        <FormPresensiKeluar
                            shiftId={shiftId}
                            setShiftId={setShiftId}
                            companiesUsersId={companiesUsersId}
                            setCompaniesUsersId={setCompaniesUsersId}
                            tanggal={tanggal}
                            setTanggal={setTanggal}
                            jam={jamKeluar}
                            setJam={setJamKeluar}
                            latitude={latitude}
                            setLatitude={setLatitude}
                            longitude={longitude}
                            setLongitude={setLongitude}
                            status={statusKeluar}
                            setStatus={setStatusKeluar}
                            keterangan={keteranganKeluar}
                            setKeterangan={setKeteranganKeluar}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Add Presensi'}
                    </Button>
                </Box>
                 <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbarSeverity} 
                        sx={{ width: '100%', color:'white' , backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Drawer>
        
    );
};

export default DrawerInputPresensi;
