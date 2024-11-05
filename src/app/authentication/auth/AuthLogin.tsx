import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    try {

      const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
      const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;

      const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

      const response = await axios.post("https://backend-apps.ptspsi.co.id/api/login", {
          email,
          password,
        }, {
          headers: {
            'Authorization': `Basic ${basicAuth}`
          }
        }
      );
    
      if (response.data.user && response.data.token) {
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 3 / 24 });
        Cookies.set("token", response.data.token, { expires: 3 / 24 });
        
        const redirectPath = response.data.user.roles[0].name === "admin" ? "/" : "/lembur";
        router.push(redirectPath);

      } else {
        setError("Login failed. Please check your credentials.");
      }
  
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  
  useEffect(() => {
    const checkSession = setInterval(() => {
      const token = Cookies.get("token");
      if (!token) {
        Cookies.remove("user");
        Cookies.remove("token");
        router.push("/authentication/login"); 
      }
    }, 7200000); 
  
    return () => clearInterval(checkSession);
  }, [router]);

  return (
    <form onSubmit={handleSubmit}>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
          >
            Email
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box mt="25px" mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
            required
          />
        </Box>
        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </form>
  );
};

export default AuthLogin;
