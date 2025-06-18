const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle joining a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle code changes
  socket.on("code-change", ({ roomId, fileId, code, sender }) => {
    // Broadcast the code changes to other clients in the same room
    console.log(
      `Code change in room ${roomId} for file ${fileId} by ${sender}`
    );
    socket.to(roomId).emit("code-update", { fileId, code, sender });
  });

  // Handle cursor position
  socket.on("cursor-move", ({ roomId, fileId, position, sender }) => {
    socket.to(roomId).emit("cursor-update", { fileId, position, sender });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Simple health check route
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Socket.IO server is running" });
});

// Start the server
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
