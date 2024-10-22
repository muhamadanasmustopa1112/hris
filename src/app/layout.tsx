"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Cookies from "js-cookie";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
   

    if (!token) {
      router.push('/authentication/login'); 
    }
  }, [router]);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
