"use client";
import React, { useEffect } from "react";
import { ReactNode } from "react";
import CodeEditor from "../../components/room/CodeEditor";
import SideBar from "../../components/room/SideBar";
import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { useRouter } from "next/navigation";
import socket from "@/utils/socket";
import { setUsername } from "@/redux/reducers/userReducer";
// import { useRouter } from "next/router";
import { setRoomId } from "@/redux/reducers/roomReducer";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import useSocket from "@/utils/useSocket";

export default function layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // store
  const username = useAppSelector((item) => item.user.username);
  const roomId = useAppSelector((item) => item.room.roomId);

  /////////////////////////////
  //////  getting user name and roomId
  /////////////////////////////
  useEffect(() => {
    if (!username) {
      let username = prompt("Enter your name");
      dispatch(setUsername(username));
    }
  }, []);

  useEffect(() => {
    const roomIdFromUrl = pathname.split("/")[1]; // Extract room ID from URL
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      dispatch(setRoomId(roomIdFromUrl));
    }
  }, [roomId, dispatch]);

  /////////////////////////////
  //////  Socket IO Implimentation
  /////////////////////////////
  useEffect(() => {
    if (username) {
      socket.emit("joinRoom", { username, roomId });
    }
  }, [username, roomId]);

  useSocket();

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
