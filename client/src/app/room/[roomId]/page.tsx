"use client";
import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import RoomSideMenu from "@/components/room/RoomSideMenu";
import { File, MessageCircle, Users, Video } from "lucide-react";
import FilesContent from "@/components/room/tab-content/FilesTabContent";
import ChatContent from "@/components/room/tab-content/ChatTabContent";
import VideochatContent from "@/components/room/tab-content/VideochatTabContent";
import CollaboratorsContent from "@/components/room/tab-content/CollaboratorsTabContent";
import SettingsContent from "@/components/room/tab-content/SettingsTabContent";
import VideoContainer from "@/components/room/container/VideoContainer";
import CodeContainer from "@/components/room/container/CodeContainer";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Link from "next/link";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const { data: session, status } = useSession();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("files");

  // MENU
  const menuItems = [
    { icon: File, label: "Files", tab: "files" },
    { icon: MessageCircle, label: "Chat", tab: "chat" },
    { icon: Video, label: "Video Chat", tab: "video" },
    { icon: Users, label: "Collaborators", tab: "collaborators" },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectedFileChange = (fileId: string) => {
    if (selectedFile === fileId) {
      return;
    } else {
      setSelectedFile(fileId); // Select the new file
    }
    console.log("Selected file ID:", fileId);
  };

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
          <div className="p-4">
            {activeTab === "files" && (
              <FilesContent onChangeSelectedFile={handleSelectedFileChange} />
            )}
            {activeTab === "chat" && <ChatContent />}
            {activeTab === "video" && <VideochatContent />}
            {activeTab === "collaborators" && <CollaboratorsContent />}
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
              <CodeContainer selectedFile={selectedFile} />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
