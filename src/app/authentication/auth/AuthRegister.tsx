import React, { useState } from 'react';
import { Typography, Button, Grid, Paper, Box } from '@mui/material';
import Link from 'next/link';

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
      const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

      const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

      const response = await axios.post("https://hris-api.ptspsi.co.id/api/create-company", {
        company_name: name,
        user_name: userName,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      }, {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });

      if (response.status == 201) {
        router.push("/authentication/login");
      } else {
        setError("Register failed. Please check your credentials.");
      }

    } catch (err) {
      setError("Register failed. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: '800px', margin: 'auto', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <form onSubmit={handleSubmit}>
        {title && (
          <Typography fontWeight="700" variant="h4" mb={2} textAlign="center">
            {title}
          </Typography>
        )}

        {subtext && (
          <Box mb={3} textAlign="center">
            {subtext}
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='name' mb="5px">
              Company Name
            </Typography>
            <CustomTextField
              id="name"
              variant="outlined"
              value={name}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setName(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: '2px' }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='username' mb="5px">
              Username
            </Typography>
            <CustomTextField
              id="username"
              variant="outlined"
              value={userName}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUserName(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px">
              Email Address
            </Typography>
            <CustomTextField
              id="email"
              variant="outlined"
              value={email}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
              required
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: '2px' }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px">
              Password
            </Typography>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password_confirmation' mb="5px">
              Password Confirmation
            </Typography>
            <CustomTextField
              id="password_confirmation"
              type="password"
              variant="outlined"
              value={passwordConfirmation}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPasswordConfirmation(e.target.value)}
              required
              fullWidth
            />
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign Up
          </Button>
        </Box>

        {error && (
          <Box mt={2} color="error.main" textAlign="center">
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        
        {subtitle && (
          <Box mt={3} textAlign="center">
            {subtitle}
          </Box>
        )}
      </form>
    </Paper>
  );
};

export default AuthRegister;
