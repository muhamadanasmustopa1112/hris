import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link  from 'next/link';

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

          const response = await axios.post("https://backend-apps.ptspsi.co.id/api/create-company", {
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
        <form onSubmit={handleSubmit}>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='name' mb="5px">Company Name</Typography>
                    <CustomTextField 
                        id="name" 
                        variant="outlined" 
                        value={name}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setName(e.target.value)}
                        required
                        fullWidth 
                    />
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px" mt="25px">Username</Typography>
                    <CustomTextField 
                        id="username" 
                        variant="outlined" 
                        value={userName}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUserName(e.target.value)}
                        required
                        fullWidth 
                    />
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
                    <CustomTextField
                        id="email" 
                        variant="outlined" 
                        value={email}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                        required
                        fullWidth 
                    />
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
                    <CustomTextField 
                        id="password" 
                        type="password"
                        variant="outlined" 
                        value={password}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                        required
                        fullWidth 
                    />
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password_confirmation' mb="5px" mt="25px">Password Confirmation</Typography>
                    <CustomTextField 
                        id="password_confirmation" 
                        type="password"
                        variant="outlined" 
                        value={passwordConfirmation}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPasswordConfirmation(e.target.value)}
                        required
                        fullWidth 
                    />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth type="submit">
                    Sign Up
                </Button>
            </Box>
            {subtitle}
        </form>
    );
}

export default AuthRegister;
