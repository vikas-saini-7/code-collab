import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = "https://realtime-code-collab.up.railway.app";

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
