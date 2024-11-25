// src/context/BeforeInstallPromptContext.tsx
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: string; platform: string }>;
}

interface BeforeInstallPromptContextProps {
  deferredPrompt: Event | null;
  showInstallButton: boolean;
  setDeferredPrompt: (event: Event | null) => void;
  setShowInstallButton: (show: boolean) => void;
}

const BeforeInstallPromptContext = createContext<BeforeInstallPromptContextProps | undefined>(undefined);

export const BeforeInstallPromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent;
      beforeInstallPromptEvent.preventDefault();
      setDeferredPrompt(beforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <BeforeInstallPromptContext.Provider value={{ deferredPrompt, showInstallButton, setDeferredPrompt, setShowInstallButton }}>
      {children}
    </BeforeInstallPromptContext.Provider>
  );
};

export const useBeforeInstallPrompt = (): BeforeInstallPromptContextProps => {
  const context = useContext(BeforeInstallPromptContext);
  if (!context) {
    throw new Error("useBeforeInstallPrompt must be used within a BeforeInstallPromptProvider");
  }
  return context;
};
