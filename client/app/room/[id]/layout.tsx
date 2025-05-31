"use client";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSocket from "@/utils/useSocket";
import SideBar from "@/components/room/SideBar";
import CodeEditor from "@/components/room/CodeEditor";
import { RoomContextProvider } from "@/providers/roomContextProvider";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useSession } from "next-auth/react";
import EditorHeader from "@/components/room/EditorHeader";
import axios from "axios";
import { toast } from "sonner";

export default function layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const socketInstance = useSocket();

  const [roomId, setRoomId] = useState<string>("");
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);

  // check if user is authenticated and has access to the room
  useEffect(() => {
    const checkRoomAccess = async (roomIdFromUrl: string) => {
      try {
        setIsCheckingAccess(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/check-participation`,
          { roomId: roomIdFromUrl },
          { withCredentials: true }
        );

        // If we get a successful response, user has access
        setRoomId(roomIdFromUrl);
        setIsCheckingAccess(false);
      } catch (error) {
        console.error("Error checking room access:", error);
        // Redirect to join room page if not authorized
        toast.error("You don't have access to this room. Please join first.");
        router.push(`/join-room/${roomIdFromUrl}`);
      }
    };

    const roomIdFromUrl = pathname.split("/")[2];
    if (roomIdFromUrl && status === "authenticated") {
      checkRoomAccess(roomIdFromUrl);
    } else if (status === "authenticated") {
      setIsCheckingAccess(false);
    }
  }, [pathname, status, router]);

  if (status === "loading" || isCheckingAccess) {
    return <LoadingSpinner text="Loading Room..." />;
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
