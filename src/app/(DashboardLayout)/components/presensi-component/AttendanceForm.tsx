import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";

interface AttendanceFormProps {
  data: string | null;
  onSubmit: (shift: string, date: string, time: string, latitude: string, longitude: string, description: string, data: string | null) => void;
}

interface Shift {
  id: number;
  name: string;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ data, onSubmit }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftId, setShiftId] = useState('');
  const [date] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
    });
  }, [basicAuth]);

  useEffect(() => {
    const fetchShifts = async () => {
      const userCookie = Cookies.get('user');
      const user = userCookie ? JSON.parse(userCookie) : null;

      if (!user || !user.company_id) {
        alert("DATA NOT FOUND!");
        return;
      }

      try {
        const response = await axios.get('https://hris-api.ptspsi.co.id/api/shift-active', {
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
      }
    };
    fetchShifts();
  }, [basicAuth]);

  const handleSubmit = () => {
    onSubmit(shiftId, date, time, latitude, longitude, description, data);
    setShiftId("");
    setDescription("");
  };

  return (
    <Box sx={{ mt: 2, width: "100%", maxWidth: "400px" }}>
      <Typography variant="h6">Data harian presensi:</Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Isi Form Berikut:
      </Typography>

      <FormControl fullWidth margin="normal" sx={{ mb: 5 }}>
        <InputLabel id="select-company-user-label">Pilih Shift</InputLabel>
        <Select
          labelId="select-company-user-label"
          value={shiftId}
          label="Pilih Shift"
          onChange={(e) => setShiftId(e.target.value)}
        >
          {shifts.map((shift) => (
            <MenuItem key={shift.id} value={shift.id}>
              {shift.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {shifts && (
        <>
          <TextField
            fullWidth
            label="Companies Users ID"
            variant="outlined"
            value={data}
            disabled
            sx={{ mb: 5, display: "none" }}
          />
          <TextField
            fullWidth
            label="Tanggal"
            variant="outlined"
            value={date}
            disabled
            sx={{ mb: 5 }}
          />
          <TextField
            fullWidth
            label="Jam"
            variant="outlined"
            value={time}
            disabled
            sx={{ mb: 5 }}
          />
          <TextField
            fullWidth
            label="Latitude"
            variant="outlined"
            value={latitude}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Longitude"
            variant="outlined"
            value={longitude}
            disabled
            sx={{ mb: 5 }}
          />
          <TextField
            fullWidth
            label="Masukan keterangan jika"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 5 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </>
      )}
    </Box>
  );
};

export default AttendanceForm;
