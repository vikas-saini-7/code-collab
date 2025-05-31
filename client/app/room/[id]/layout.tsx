"use client";
import React, { useEffect } from "react";
import { ReactNode } from "react";
import socket from "@/utils/socket";
import { usePathname } from "next/navigation";
import useSocket from "@/utils/useSocket";
import SideBar from "@/components/room/SideBar";
import CodeEditor from "@/components/room/CodeEditor";
import { RoomContextProvider } from "@/providers/roomContextProvider";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useSession } from "next-auth/react";
import EditorHeader from "@/components/room/EditorHeader";

export default function layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { data: session, status } = useSession();

  // store
  const [roomId, setRoomId] = React.useState<string>("");

  useEffect(() => {
    const roomIdFromUrl = pathname.split("/")[2];
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      setRoomId(roomIdFromUrl);
    }
  }, []);

  if (status === "loading") {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Please login to access this page</h1>
      </div>
    );
  }

  return (
    <RoomContextProvider roomId={roomId}>
      <div className="max-w-[1680px] mx-auto flex w-full h-screen">
        {/* sidebar  */}
        <div className="w-[320px] lg:w-[400px]">
          <div className="flex h-screen">
            {/* features list  */}
            <SideBar />
            {/* feature body with context provider */}
            <div className="w-full border-r overflow-auto h-screen">
              {children}
            </div>
          </div>
        </div>

        {/* code editor  */}
        <div className="flex-1 h-screen">
          <EditorHeader />
          <CodeEditor />
        </div>
      </div>
    </RoomContextProvider>
  );
}
