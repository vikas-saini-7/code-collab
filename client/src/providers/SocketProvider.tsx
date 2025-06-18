"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  emitCodeChange: (data: {
    roomId: string;
    fileId: string;
    code: string;
    sender: string;
  }) => void;
  emitCursorMove: (data: {
    roomId: string;
    fileId: string;
    position: any;
    sender: string;
  }) => void;
  emitMessage: (data: { roomId: string; message: any }) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  emitCodeChange: () => {},
  emitCursorMove: () => {},
  emitMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the Socket.io server
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.io server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
      toast.error("Socket connection lost");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Failed to connect to server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit("join-room", roomId);
    }
  };

  const emitCodeChange = (data: {
    roomId: string;
    fileId: string;
    code: string;
    sender: string;
  }) => {
    if (socket && isConnected) {
      socket.emit("code-change", data);
    }
  };

  const emitCursorMove = (data: {
    roomId: string;
    fileId: string;
    position: any;
    sender: string;
  }) => {
    if (socket && isConnected) {
      socket.emit("cursor-move", data);
    }
  };

  const emitMessage = (data: { roomId: string; message: any }) => {
    if (socket && isConnected) {
      socket.emit("message", data);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinRoom,
        emitCodeChange,
        emitCursorMove,
        emitMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
