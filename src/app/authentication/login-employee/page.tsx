"use client";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Image from 'next/image';

import AuthLogin2 from "../auth/AuthLogin2";

const Login = () => {
  return (
    <PageContainer title="Login" description="">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                {/* <img src="/images/logos/my-abseni.png" alt="My Absensi" style={{ width: '100%', marginTop: '-100px', marginBottom: '-150px'}} /> */}
                <Image 
                  src="/images/logos/logo.png" 
                  alt="My Absensi" 
                  width={250}
                  height={250}
                  style={{ width: 'auto', marginTop: '-90px', marginBottom: '-100px' }}
                  priority
                />
              </Box>
              <AuthLogin2
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Login;
