// import React, { useEffect, useState, useCallback } from "react";
// import CodeEditor from "../CodeEditor";
// import { fetchFile, updateFileContent } from "@/services/file-services";
// import { IconCode } from "@tabler/icons-react";
// import { debounce } from "lodash";

// interface CodeContainerProps {
//   selectedFile: string | null;
// }

// const CodeContainer: React.FC<CodeContainerProps> = ({ selectedFile }) => {
//   const [code, setCode] = useState("");
//   const [isSaving, setIsSaving] = useState(false);
//   const [showSaved, setShowSaved] = useState(false);

//   const fetchFileData = async (fileId: string) => {
//     const res = await fetchFile(fileId);
//     if (res.status === 200) {
//       setCode(res.data.content);
//     }
//   };

//   // Debounced save function using lodash
//   const debouncedSave = useCallback(
//     debounce(async (fileId: string, content: string) => {
//       setIsSaving(true);
//       const res = await updateFileContent(fileId, content);
//       if (res?.status) {
//         setIsSaving(false);
//         setShowSaved(true);
//         setTimeout(() => setShowSaved(false), 500);
//       }
//     }, 500),
//     []
//   );

//   const handleCodeChange = (newCode: string) => {
//     setCode(newCode);
//     if (selectedFile) {
//       debouncedSave(selectedFile, newCode);
//     }
//   };

//   useEffect(() => {
//     if (selectedFile) {
//       fetchFileData(selectedFile);
//     }
//   }, [selectedFile]);

//   return (
//     <div className="relative">
//       {selectedFile ? (
//         <>
//           {isSaving && !showSaved && (
//             <div className="absolute z-50 top-2 right-4 text-yellow-400 text-sm">
//               Saving...
//             </div>
//           )}
//           {showSaved && (
//             <div className="absolute z-50 top-2 right-4 text-green-400 text-sm">
//               Saved ✅
//             </div>
//           )}
//           <CodeEditor code={code} onChange={handleCodeChange} />
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-screen">
//           <IconCode size={72} />
//           <p className="text-white/30">Pick a File to start Editing..</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeContainer;
"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { IconCode } from "@tabler/icons-react";
import CodeEditor from "../CodeEditor";
import { useSocket } from "@/providers/SocketProvider";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface CodeContainerProps {
  selectedFile: string | null;
  // roomId: string;
}

const CodeContainer: React.FC<CodeContainerProps> = ({
  selectedFile,
  // roomId,
}) => {
  const params = useParams();
  const roomId = params.roomId as string;
  const [code, setCode] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const { socket, isConnected, joinRoom, emitCodeChange } = useSocket();
  const { data: session } = useSession();

  const fetchFileData = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`);
      if (!response.ok) throw new Error("Failed to fetch file");

      const fileData = await response.json();
      setCode(fileData.content || "");
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

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
    if (selectedFile) {
      // Save to the database with debounce
      debouncedSave(selectedFile, newCode);

      // Emit code changes to other users through Socket.io
      if (session?.user?.id) {
        emitCodeChange({
          roomId,
          fileId: selectedFile,
          code: newCode,
          sender: session.user.id,
        });
      }
    }
  };

  useEffect(() => {
    if (selectedFile) {
      fetchFileData(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (roomId && isConnected) {
      // Listen for code updates from other users
      if (socket) {
        socket.on("code-update", ({ fileId, code: updatedCode, sender }) => {
          // Only update if it's the current file and not from self
          if (fileId === selectedFile && session?.user?.id !== sender) {
            setCode(updatedCode);
          }
        });

        return () => {
          socket.off("code-update");
        };
      }
    }
  }, [roomId, isConnected, socket, selectedFile, session?.user?.id, joinRoom]);

  return (
    <div className="relative">
      {selectedFile ? (
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
          <CodeEditor code={code} onChange={handleCodeChange} />
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
