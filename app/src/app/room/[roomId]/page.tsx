"use client";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import RoomSideMenu from "@/components/room/RoomSideMenu";
import { File, MessageCircle, Phone, Users, Video } from "lucide-react";
import FilesContent from "@/components/room/tab-content/FilesTabContent";
import SettingsContent from "@/components/room/tab-content/SettingsTabContent";
import VideoContainer from "@/components/room/container/VideoContainer";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import ShareModalAtStart from "@/components/room/ShareModalAtStart";
import CallingTabContent from "@/components/room/tab-content/CallingTabContent";
import ChatTabContent from "@/components/room/tab-content/ChatTabContent";
import VideochatTabContent from "@/components/room/tab-content/VideochatTabContent";
import CollaboratorsTabContent from "@/components/room/tab-content/CollaboratorsTabContent";
import { IFile } from "@/types/types";
import CodeContainer from "@/components/room/container/CodeContainer";

const page = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const { data: session, status } = useSession();
  const { socket, isConnected, joinRoom } = useSocket();

  const [activeFile, setActiveFile] = useState<IFile | null>(null);

  const [activeTab, setActiveTab] = useState("files");

  // MENU
  const menuItems = [
    { icon: File, label: "Files", tab: "files" },
    { icon: MessageCircle, label: "Chat", tab: "chat" },
    { icon: Phone, label: "Calling", tab: "calling" },
    { icon: Video, label: "Video Call", tab: "video" },
    { icon: Users, label: "Collaborators", tab: "collaborators" },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleActiveFileChange = (file: IFile) => {
    if (activeFile === file) {
      return;
    } else {
      console.log("Active file changed to:", file);
      setActiveFile(file);
    }
  };

  useEffect(() => {
    if (roomId && isConnected) {
      // Join the room when the component mounts
      joinRoom(roomId);
    }
  }, [roomId, isConnected, socket, session?.user?.id, joinRoom]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">
          You must be logged in to access this room.
        </p>
        <Link
          href={`/login?redirect=${roomId}`}
          className="ml-4 text-blue-500 hover:underline"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex ">
      {/* Main Menu  */}
      <RoomSideMenu menuItems={menuItems} onTabChange={handleTabChange} />

      {/* resizable sections  */}
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen w-full"
      >
        {/* Tab Content  */}
        <ResizablePanel defaultSize={25}>
          <div className="">
            {activeTab === "files" && (
              <FilesContent
                activeFile={activeFile}
                onChangeActiveFile={handleActiveFileChange}
              />
            )}
            {activeTab === "chat" && <ChatTabContent />}
            {activeTab === "calling" && <CallingTabContent />}
            {activeTab === "video" && <VideochatTabContent />}
            {activeTab === "collaborators" && <CollaboratorsTabContent />}
            {activeTab === "settings" && <SettingsContent />}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Content */}
        <ResizablePanel defaultSize={75}>
          <div className="h-full">
            {activeTab === "video" ? (
              <VideoContainer />
            ) : (
              <CodeContainer activeFile={activeFile} />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <ShareModalAtStart />
    </div>
  );
};

export default page;
