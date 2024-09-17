import React from "react";
import { ReactNode } from "react";
import CodeEditor from "../../components/room/CodeEditor";
import SideBar from "../../components/room/SideBar";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1680px] mx-auto flex w-full h-screen">
      {/* sidebar  */}
      <div className="w-[320px]">
        <div className="flex h-screen bg-[#181926]">
          {/* features list  */}
          <SideBar />

          {/* feature body  */}
          <div className="w-full bg-[#1f2130]">{children}</div>
        </div>
      </div>

      {/* code editor  */}
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}
