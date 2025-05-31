// useSocket.ts
import { useEffect } from "react";
import io from "socket.io-client";
import socket from "./socket";
import { useAppDispatch } from "@/redux/store";
import { toast } from "sonner";

const useSocket = () => {
  return socket;
};

export default useSocket;
