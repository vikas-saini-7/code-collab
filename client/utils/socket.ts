import { io } from "socket.io-client";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const socket = io(BASE_URL);

// socket.on("connect", () => {
//   toast.success("Connected to backend");
//   console.log("Connected to backend");
// });

// socket.on("connect_error", (error) => {
//   toast.error("Error in connecting to backend");
//   console.error("Connection error:", error);
// });

export default socket;
