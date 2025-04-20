"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "sonner";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
};

export default GlobalProvider;
