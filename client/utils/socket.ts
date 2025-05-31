import { io } from "socket.io-client";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
const socket = io(BASE_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection event handlers
socket.on("connect", () => {
  console.log("Connected to code collaboration server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  toast.error("Failed to connect to collaboration server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from code collaboration server");
});

export default socket;