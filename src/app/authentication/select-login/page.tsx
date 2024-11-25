"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography, Button } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Image from 'next/image';

const SelectLogin = () => {
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
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={10}
            md={6}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={10}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px", textAlign: "center" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" mb={5}>
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
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Welcome to My Absensi
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" mb={3}>
                Aplikasi untuk mempermudah absensi
              </Typography>

              {/* Button Options for Login */}
              <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  href="/authentication/login-employee"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "primary.main",
                    '&:hover': {
                      backgroundColor: "#2563eb",
                    }
                  }}
                >
                  Login Employee
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default SelectLogin;
