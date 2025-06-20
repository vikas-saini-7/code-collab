"use client";
import React from "react";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
};

export default GlobalProvider;
