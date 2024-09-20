import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

const socket = io(backendUrl);

// socket.on("connect", () => {
//   toast.success("Connected to backend");
//   console.log("Connected to backend");
// });

// socket.on("connect_error", (error) => {
//   toast.error("Error in connecting to backend");
//   console.error("Connection error:", error);
// });

export default socket;
