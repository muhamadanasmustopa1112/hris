// src/components/InstallAppButton.tsx
"use client";
import React from "react";
import { Button, Box, useTheme } from "@mui/material";
import Download from "@mui/icons-material/Download";
import { useBeforeInstallPrompt } from "@/app/context/BeforeInstallPromptContext";

const InstallAppButton: React.FC = () => {
  const { deferredPrompt, showInstallButton, setDeferredPrompt, setShowInstallButton } = useBeforeInstallPrompt();
  const theme = useTheme();

  const handleClickInstallAppButton = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt(); 
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); 
        setShowInstallButton(false); 
      });
    }
  };

  return (
    showInstallButton && (
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={handleClickInstallAppButton}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            fontWeight: "bold",
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Install App
        </Button>
      </Box>
    )
  );
};

export default InstallAppButton;
