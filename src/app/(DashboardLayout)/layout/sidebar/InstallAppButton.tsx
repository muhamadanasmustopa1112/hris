// InstallAppButton.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import Download from "@mui/icons-material/Download";

interface InstallAppButtonProps {
  onClick?: () => void;
}

const InstallAppButton: React.FC<InstallAppButtonProps> = ({ onClick }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

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

    if (onClick) onClick();
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
            backgroundColor: "#5d87ff",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4a75d8",
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
