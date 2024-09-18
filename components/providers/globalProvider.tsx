"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";
import useSocket from "@/utils/useSocket";

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
