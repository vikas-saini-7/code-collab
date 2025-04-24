"use client";
import React, { useEffect } from "react";
import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import socket from "@/utils/socket";
import { setUsername } from "@/redux/reducers/userReducer";
import { setRoomId } from "@/redux/reducers/roomReducer";
import { usePathname } from "next/navigation";
import useSocket from "@/utils/useSocket";
import SideBar from "@/components/room/SideBar";
import CodeEditor from "@/components/room/CodeEditor";
import { RoomContextProvider } from "@/providers/roomContextProvider";

export default function layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // store
  const username = useAppSelector((item) => item.user.username);
  const roomId = useAppSelector((item) => item.room.roomId);

  /////////////////////////////
  //////  getting user name and roomId
  /////////////////////////////
  // useEffect(() => {
  //   if (!username) {
  //     let username = prompt("Enter your name");
  //     dispatch(setUsername(username));
  //   }
  // }, []);

  useEffect(() => {
    const roomIdFromUrl = pathname.split("/")[2]; // Fix to correctly extract room ID from URL
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      dispatch(setRoomId(roomIdFromUrl));
    }
  }, [pathname, dispatch]);

  /////////////////////////////
  //////  Socket IO Implimentation
  /////////////////////////////
  useEffect(() => {
    if (username && roomId) {
      socket.emit("joinRoom", { username, roomId });
    }
  }, [username, roomId]);

  useSocket();

  return (
    <div className="max-w-[1680px] mx-auto flex w-full h-screen">
      {/* sidebar  */}
      <div className="w-[320px] lg:w-[400px]">
        <div className="flex h-screen">
          {/* features list  */}
          <SideBar />

          {/* feature body with context provider */}
          <div className="w-full border-r overflow-auto h-screen">
            <RoomContextProvider roomId={roomId}>
              {children}
            </RoomContextProvider>
          </div>
        </div>
      </div>

      {/* code editor  */}
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}
