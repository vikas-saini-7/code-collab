import { Header } from "@/components/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
};

export default layout;
