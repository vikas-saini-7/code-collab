import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/providers/SocketProvider";
import { createMessage, getMessages } from "@/services/message-service";
import { IconPoint, IconPointFilled, IconUsers } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState, FormEvent, useRef, useEffect } from "react";

interface IUser {
  _id: string;
  name: string;
  profile: string; // URL to the user's profile picture
}

// Define message type
type Message = {
  _id: string;
  message: string;
  sender: IUser;
  roomId: string;
};

export default function ChatTabContent() {
  const { roomId } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;

  const { socket, isConnected, joinRoom, emitMessage, collaborators } =
    useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // emit message with  emitMessage
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await createMessage(roomId as string, newMessage);
    if (res.status === 201) {
      // If message creation is successful, add it to the messages state
      setMessages((prevMessages) => [...prevMessages, res.data]);
      setNewMessage("");

      // EMIT MESSAGE
      emitMessage({
        roomId: roomId as string,
        message: res.data,
      });
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await getMessages(roomId as string);
      if (res.status === 200) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollableArea) {
        scrollableArea.scrollTop = scrollableArea.scrollHeight;
      }
    }
  }, [messages]);

  // LISTEN TO MESSAGES
  useEffect(() => {
    if (roomId && isConnected) {
      // Listen for code updates from other users
      if (socket) {
        socket.on("new-message", ({ message }) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
          socket.off("new-message");
        };
      }
    }
  }, [roomId, isConnected, socket, session?.user?.id, joinRoom]);

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback>
            <IconUsers size={14} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-medium whitespace-nowrap">
            <span className="text-white/50">Room/ </span>
            {roomId}
          </h3>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <IconPointFilled size={16} className="text-green-500" />
            {collaborators.length || 0} people online
          </p>
        </div>
      </div>

      {/* Chat messages - flex-1 allows it to expand to fill available space */}
      <ScrollArea className="flex-1 p-4 overflow-auto" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="space-y-4">
            {/* First message - left side */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div>
                {/* <Skeleton className="h-4 w-20 mb-1" /> */}
                <Skeleton className="h-12 w-[220px] rounded-lg" />
              </div>
            </div>

            {/* Second message - right side */}
            <div className="flex items-start gap-2 justify-end">
              <div className="text-right">
                {/* <Skeleton className="h-4 w-20 mb-1 ml-auto" /> */}
                <Skeleton className="h-12 w-[200px] rounded-lg" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            </div>

            {/* Third message - left side */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="h-12 w-[220px] rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  message?.sender?._id === userId ? "justify-end" : ""
                }`}
              >
                {message.sender._id !== userId && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message?.sender?.profile} />
                    <AvatarFallback>
                      {message?.sender?.name.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card className="max-w-[80%] py-2">
                  <CardContent className="px-4">
                    <p className="text-sm">{message?.message}</p>
                  </CardContent>
                </Card>

                {message.sender._id === userId && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message?.sender?.profile} />
                    <AvatarFallback>
                      {message?.sender?.name.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Chat input */}
      <div className="border-t p-4">
        <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button size="sm" type="submit">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
