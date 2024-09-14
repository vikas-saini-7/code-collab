"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import React from "react";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default GlobalProvider;