import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";
// import { toast } from "react-hot-toast";

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
}

interface RoomContextType {
  roomData: RoomData | null;
  loading: boolean;
  error: string | null;
  fetchRoomData: (roomId: string) => Promise<void>;
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
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomData = async (roomId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/${roomId}`,
        { withCredentials: true }
      );
      setRoomData(response.data.data);
      // console.log("Room data:", response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching room data:", err);
      //   toast.error("Failed to load room data");
      setError("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch room data when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchRoomData(roomId);
    }
  }, [roomId]);

  return (
    <RoomContext.Provider value={{ roomData, loading, error, fetchRoomData }}>
      {loading ? <LoadingSpinner size="sm" /> : children}
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
