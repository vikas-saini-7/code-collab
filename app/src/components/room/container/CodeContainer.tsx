"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { IconCode } from "@tabler/icons-react";
import CodeEditor from "../CodeEditor";
import { useSocket } from "@/providers/SocketProvider";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { IFile } from "@/types/types";

interface CodeContainerProps {
  activeFile: IFile | null;
}

const CodeContainer: React.FC<CodeContainerProps> = ({
  activeFile,
  // roomId,
}) => {
  const params = useParams();
  const roomId = params.roomId as string;
  const [code, setCode] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const { socket, isConnected, joinRoom, emitCodeChange } = useSocket();
  const { data: session } = useSession();

  const debouncedSave = useCallback(
    debounce(async (fileId: string, content: string) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          setIsSaving(false);
          setShowSaved(true);
          setTimeout(() => setShowSaved(false), 500);
        }
      } catch (error) {
        console.error("Error saving file:", error);
        setIsSaving(false);
      }
    }, 500),
    []
  );

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (activeFile) {
      // Save to the database with debounce
      debouncedSave(activeFile._id, newCode);

      // Emit code changes to other users through Socket.io
      if (session?.user?.id) {
        emitCodeChange({
          roomId,
          fileId: activeFile._id,
          code: newCode,
          sender: session.user.id,
        });
      }
    }
  };

  useEffect(() => {
    if (roomId && isConnected) {
      // Listen for code updates from other users
      if (socket) {
        socket.on("code-update", ({ fileId, code: updatedCode, sender }) => {
          // Only update if it's the current file and not from self
          if (fileId === activeFile?._id && session?.user?.id !== sender) {
            setCode(updatedCode);
          }
        });

        return () => {
          socket.off("code-update");
        };
      }
    }
  }, [roomId, isConnected, socket, activeFile, session?.user?.id, joinRoom]);

  return (
    <div className="relative">
      {activeFile ? (
        <>
          {isSaving && !showSaved && (
            <div className="absolute z-50 top-2 right-4 text-yellow-400 text-sm">
              Saving...
            </div>
          )}
          {showSaved && (
            <div className="absolute z-50 top-2 right-4 text-green-400 text-sm">
              Saved ✅
            </div>
          )}
          <CodeEditor
            code={activeFile.content}
            onChange={handleCodeChange}
            language={activeFile.language}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <IconCode size={72} />
          <p className="text-white/30">Pick a File to start Editing..</p>
        </div>
      )}
    </div>
  );
};

export default CodeContainer;
