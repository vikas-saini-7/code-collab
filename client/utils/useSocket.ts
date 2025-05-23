// useSocket.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import socket from "./socket";
import { setActiveUsers, setMessages } from "@/redux/reducers/roomReducer";
import { useAppDispatch } from "@/redux/store";
import { changeCodeInFile } from "@/redux/reducers/filesReducer";
import { toast } from "sonner";

const useSocket = () => {
  const dispatch = useAppDispatch();

  //   user list
  useEffect(() => {
    socket.on("userList", (users: string[]) => {
      dispatch(setActiveUsers(users));
    });

    return () => {
      socket.off("userList");
    };
  }, [dispatch]);

  //message functionalities

  useEffect(() => {
    socket.on("chatMessage", (message: any) => {
      dispatch(setMessages(message));
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

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

  //   changeCode
  useEffect(() => {
    socket.on("changeCode", (data: any) => {
      // console.log("from socket: ", data.code, data.fileId, data.username);

      dispatch(
        changeCodeInFile({
          fileId: data.fileId,
          code: data.code,
          username: data.username,
        })
      );
    });

    return () => {
      socket.off("changeCode");
    };
  }, []);

  // Add room settings update listener
  useEffect(() => {
    socket.on("roomSettingsUpdate", (settings: any) => {
      // Update room settings in the context
      if (settings.configuration) {
        setChatEnabled(settings.configuration.chatEnabled);
      }
      if (settings.permissions) {
        setCodeEditPermission(settings.permissions.codeEdit);
      }
      if (settings.maxParticipants) {
        setMaxParticipants(settings.maxParticipants);
      }
    });

    return () => {
      socket.off("roomSettingsUpdate");
    };
  }, []);

  return socket;
};

export default useSocket;
