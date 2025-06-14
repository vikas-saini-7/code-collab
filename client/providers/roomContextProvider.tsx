import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { debounce } from "lodash";
import socket from "@/utils/socket";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

// Define types
interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
}

interface Participant {
  user: User;
  joinedAt: string;
  _id: string;
}

interface Permissions {
  codeEdit: "host" | "all" | "specific";
  allowedEditors: string[];
}

interface Configuration {
  chatEnabled: boolean;
}

interface File {
  _id: string;
  roomId: string;
  fileName: string;
  language: string;
  extension: string;
  content: string;
  createdBy: string;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RoomData {
  _id: string;
  roomId: string;
  name: string;
  type: string;
  description: string;
  maxParticipants: number;
  timeZone: string;
  host: string;
  joinLink: string;
  participants: Participant[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  configuration: Configuration;
  permissions: Permissions;
  files: File[];
}

interface RoomContextType {
  roomData: RoomData | null;
  loading: boolean;
  error: string | null;
  fetchRoomData: (roomId: string) => Promise<void>;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData | null>>;
  activeFile: File | null;
  setActiveFile: React.Dispatch<React.SetStateAction<File | null>>;
  updateFileContent: (fileId: string, content: string, roomId: string) => void;
  saveStatus: "saved" | "saving" | "idle";
}

// Create the context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Create the provider component
export function RoomContextProvider({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) {

  const router = useRouter(); 
  const username = useAppSelector((state) => state.profile.username);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">(
    "saved"
  );

  const fetchRoomData = async (roomId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/${roomId}`,
        { withCredentials: true }
      );
      setRoomData(response.data.data);

      // Set the first file as active by default if available and no active file is set
      if (response.data.data?.files?.length > 0 && !activeFile) {
        setActiveFile(response.data.data.files[0]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching room data:", err);
      //   toast.error("Failed to load room data");
      setError("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  // Function to save file to the backend
  const saveFileToBackend = async (
    fileId: string,
    content: string,
    roomId: string
  ) => {
    try {
      setSaveStatus("saving");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/auto-save`,
        { fileId, content, roomId: roomId },
        { withCredentials: true }
      );

      setSaveStatus("saved");
      // Optionally add toast notification
      // toast.success("Changes saved");
    } catch (err) {
      console.error("Error saving file:", err);
      setSaveStatus("idle");
      // toast.error("Failed to save changes");
    }
  };

  // Create debounced save function that persists between renders
  const debouncedSave = useCallback(
    debounce((fileId: string, content: string, roomId: string) => {
      saveFileToBackend(fileId, content, roomId);
    }, 500), // 500 M.second delay
    []
  );

  // Update file content and trigger auto-save
  const updateFileContent = useCallback(
    (fileId: string, content: string, roomIdMongo: string) => {
      // Update the local state immediately
      setRoomData((prevRoomData) => {
        if (!prevRoomData) return null;

        const updatedFiles = prevRoomData.files.map((file) => {
          if (file._id === fileId) {
            return { ...file, content };
          }
          return file;
        });

        // If this is the active file, update it as well
        if (activeFile && activeFile._id === fileId) {
          setActiveFile({ ...activeFile, content });
        }

        return { ...prevRoomData, files: updatedFiles };
      });

      // Emit code changes to all users in the room
      socket.emit("change-code", {
        fileId,
        code: content,
        username,
        roomId: roomId,
      });

      // Trigger the debounced save
      debouncedSave(fileId, content, roomIdMongo);
    },
    [debouncedSave, activeFile]
  );

  // Fetch room data when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchRoomData(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId) {
      toast.error("Socket connection or room ID is not available");
      return;
    }

    const handleCodeChange = ({
      fileId,
      code,
      username: senderUsername,
    }: {
      fileId: string;
      code: string;
      username: string;
    }) => {

      const currentUsername = username; 

      if (senderUsername === currentUsername) {
        return;
      }

      console.log("Updating code from remote user:", senderUsername);

      // Update local state with received code changes
      setRoomData((prevRoomData) => {
        if (!prevRoomData) {
          console.log("No previous room data");
          return null;
        }

        const fileExists = prevRoomData.files.some((f) => f._id === fileId);
        if (!fileExists) {
          return prevRoomData;
        }

        const updatedFiles = prevRoomData.files.map((file) => {
          if (file._id === fileId) {
            return { ...file, content: code };
          }
          return file;
        });

        // If this is the active file, update it as well
        if (activeFile && activeFile._id === fileId) {
          setActiveFile({ ...activeFile, content: code });
        }

        return { ...prevRoomData, files: updatedFiles };
      });

      // Show a toast notification
      // toast.info(`${senderUsername} updated the code`, { duration: 2000 });
    };

    // Use "change-code" to match the server's emit event name
    socket.on("change-code", handleCodeChange);

    // Clean up the event listener on unmount
    return () => {
      socket.off("change-code", handleCodeChange);
    };
  }, [socket, roomId, activeFile, username]);

  return (
    <RoomContext.Provider
      value={{
        roomData,
        loading,
        error,
        fetchRoomData,
        setRoomData,
        activeFile,
        setActiveFile,
        updateFileContent,
        saveStatus,
      }}
    >
      {loading ? <LoadingSpinner text="Loading Room..." /> : children}
    </RoomContext.Provider>
  );
}

// Create a custom hook to use the context
export function useRoomContext() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
}
