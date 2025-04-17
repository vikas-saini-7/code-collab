"use client";
import React, { useEffect, useRef, useState } from "react";
import socket from "@/utils/socket";
import { setMessages } from "@/redux/reducers/roomReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const page: React.FC = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  // local
  const [message, setMessage] = useState("");

  // store
  const roomId = useAppSelector((item) => item.room.roomId);
  const username = useAppSelector((item) => item.user.username);
  const messages = useAppSelector((item) => item.room.messages);

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("chatMessage", { message, roomId, username });
      setMessage("");
    }
  };

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="mb-2">Group Chat</h1>
      <div className="flex-1 overflow-auto">
        {messages.map((msg: any, index) => (
          <div
            className="flex items-center gap-1 bg-gray-500/10 px-2 py-1 mb-[4px] rounded"
            key={index}
          >
            <p className="flex justify-center h-6 w-6 rounded-full bg-gray-500/50">
              {msg.username.charAt(0)}
            </p>
            <p className="break-words whi">{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-col">
        <Input
          ref={inputRef}
          type="text"
          className="rounded"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnterPress}
        />
        <Button className="bg-[#00E87B] w-full font-bold" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default page;
