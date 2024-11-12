"use client";

import { useState } from "react";
import { Box, Typography, Paper, Button, Snackbar, Alert } from "@mui/material";
import dynamic from "next/dynamic";
import PageContainer from "../../components/container/PageContainer";
import DashboardCard from "../../components/shared/DashboardCard";
import axios, { AxiosError } from "axios";
import AttendanceForm2 from "../../components/presensi-component/AttendanceForm2";

const FaceRecognition = dynamic(
  () => import("../../components/facerecognation/FaceRecognition"),
  { ssr: false }
);

const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

export default function ScanQRPage2() {
  const [data, setData] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [faceRecognized, setFaceRecognized] = useState<boolean>(false);
  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleScan = (err: any, result: any) => {
    if (result) {
      setData(result.text);
      setScanning(false);
      setShowForm(true);
    }
    if (err) {
      console.error(err);
      setError("Scanning failed");
    }
  };

  const handleFaceRecognitionSuccess = () => {
    setFaceRecognized(true);
  };

  const handleFormSubmit = async (
    shift: string,
    date: string,
    time: string,
    latitude: string,
    longitude: string,
    description: string,
    status: string,
  ) => {
    const dataKeluar = {
      shift_id: shift,
      companies_users_id: data,
      tanggal:date,
      jam:time,
      latitude:latitude,
      longtitude:longitude,
      keterangan:description,
      status:status,
    };

    try {
      const response = await axios.post('https://backend-apps.ptspsi.co.id/api/presensi-keluar', dataKeluar, {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        },
      });
    
      setSnackbar({ open: true, message: "Form submitted successfully!", severity: "success" });
    
    } catch (error) {
      // Pastikan `error` adalah tipe `AxiosError`
      const submitError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
    
      let errorMessage = "Form submission failed.";
    
      if (submitError.response?.data?.errors) {
        const errors = submitError.response.data.errors;
    
        errorMessage = Object.values(errors)
          .flat()
          .join(", ");
      } else if (submitError.response?.data?.message) {
        errorMessage = submitError.response.data.message;
      }
    
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
    
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageContainer title="Presensi Keluar" description="Halaman untuk presensi keluar karyawan">
      <DashboardCard title="">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!faceRecognized ? (
            <FaceRecognition userId={123} onSuccess={handleFaceRecognitionSuccess} />
          ) : (
            <>
              {!scanning && !showForm && (
                <Button
                  variant="contained"
                  onClick={() => setScanning(true)}
                  sx={{ mb: 2 }}
                >
                  Absen Sekarang
                </Button>
              )}
              {scanning && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <BarcodeScannerComponent
                    onUpdate={handleScan}
                    width={300}
                    height={300}
                  />
                </Paper>
              )}
              {showForm && (
                <AttendanceForm2 data={data} onSubmit={handleFormSubmit} />
              )}
            </>
          )}

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {error}
            </Typography>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity} 
              sx={{ 
                width: "100%", 
                color: "white", 
                backgroundColor: snackbar.severity === "success" ? "green" : "red" 
              }}            
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
