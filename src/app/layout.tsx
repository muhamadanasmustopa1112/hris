"use client";

import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from 'js-cookie'; // Import js-cookie
import { BeforeInstallPromptProvider } from "./context/BeforeInstallPromptContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [backPressedTwice, setBackPressedTwice] = useState(false); // Tambahkan state untuk deteksi 2x tekan back
  const pathname = usePathname();

  useEffect(() => {
    const blockBackButton = () => {
      window.history.pushState(null, "", window.location.href); // Block back
    };

    const handlePopState = () => {
      if (backPressedOnce) {
        if (backPressedTwice) {
          
          Cookies.remove("token"); 
          window.location.href = "/authentication/select-login"; 
        } else {
          setBackPressedTwice(true); 
          setTimeout(() => {
            setBackPressedTwice(false);
          }, 2000);
        }
      } else {
        setBackPressedOnce(true);

        setTimeout(() => {
          setBackPressedOnce(false);
        }, 2000);
      }
    };

    blockBackButton();
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, backPressedOnce, backPressedTwice]);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <BeforeInstallPromptProvider>
          <ThemeProvider theme={baselightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </BeforeInstallPromptProvider>
      </body>
    </html>
  );
}
