// useSocket.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import socket from "./socket";
import { setActiveUsers } from "@/redux/reducers/roomReducer";
import toast from "react-hot-toast";

const useSocket = () => {
  const dispatch = useDispatch();

  //   user list
  useEffect(() => {
    socket.on("userList", (users: string[]) => {
      dispatch(setActiveUsers(users));
    });

    return () => {
      socket.off("userList");
    };
  }, [dispatch]);

  //   joined and left
  useEffect(() => {
    socket.on("roomMessage", (message: string) => {
      toast(message, {
        icon: "👋",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    return () => {
      socket.off("roomMessage");
    };
  }, []);

  return socket;
};

export default useSocket;
