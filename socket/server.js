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
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const roomUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle joining a room
  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.user = user;

    // Add user to room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    roomUsers.get(roomId).set(socket.id, user);

    // Broadcast updated users list to all clients in the room
    const usersInRoom = Array.from(roomUsers.get(roomId).values());
    io.to(roomId).emit("collaborators-update", usersInRoom);

    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle code changes
  socket.on("code-change", ({ roomId, fileId, code, sender }) => {
    // Broadcast the code changes to other clients in the same room
    socket.to(roomId).emit("code-update", { fileId, code, sender });
  });

  // Handle cursor position
  socket.on("cursor-move", ({ roomId, fileId, position, sender }) => {
    socket.to(roomId).emit("cursor-update", { fileId, position, sender });
  });

  // handle message
  socket.on("message", ({ roomId, message }) => {
    // console.log(`Message from ${sender} in room ${roomId}: ${message}`);
    socket.to(roomId).emit("new-message", { message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove user from room tracking
    if (socket.roomId && roomUsers.has(socket.roomId)) {
      roomUsers.get(socket.roomId).delete(socket.id);

      // If room is empty, remove it
      if (roomUsers.get(socket.roomId).size === 0) {
        roomUsers.delete(socket.roomId);
      } else {
        // Broadcast updated user list
        const usersInRoom = Array.from(roomUsers.get(socket.roomId).values());
        io.to(socket.roomId).emit("collaborators-update", usersInRoom);
      }
    }
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
