require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors"); // Import CORS
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);

// Enable CORS for all requests
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://realtime-code-collab.vercel.app",
    ], // Allow requests from your Next.js frontend and Vercel app
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://realtime-code-collab.vercel.app",
    ], // Allow the frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// =======================

let activeUsers = {};
let roomUsers = {}; // Mapping of roomId to list of users in that room

io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  // When a user joins a room
  socket.on("joinRoom", ({ username, roomId }) => {
    socket.join(roomId);
    activeUsers[socket.id] = { username, roomId };

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
    roomUsers[roomId].push(username);

    console.log(`${username} joined room: ${roomId}`);
    io.to(roomId).emit("userList", roomUsers[roomId]);
    io.to(roomId).emit("roomMessage", `${username} has joined the room`);
  });

  // When a user sends a message, broadcast it to the room
  socket.on("chatMessage", ({ roomId, username, message }) => {
    if (roomUsers[roomId]) {
      // Check if the room exists and has users
      console.log("Message sent to room:", roomId);
      io.to(roomId).emit("chatMessage", { username, message });
    } else {
      console.log("Room not found or empty:", roomId);
    }
  });

  //when user changes code in the code editor
  socket.on("changeCode", ({ fileId, code, username, roomId }) => {
    console.log(fileId, code, username, roomId);
    io.to(roomId).emit("changeCode", { fileId, code, username });
  });

  socket.on("showTooltip", (data) => {
    const { roomId, text, position } = data;
    io.to(roomId).emit("showTooltip", { text, position });
  });

  // When a user disconnects, remove them from active users
  socket.on("disconnect", () => {
    const user = activeUsers[socket.id];
    if (user) {
      const { username, roomId } = user;
      delete activeUsers[socket.id];

      if (roomUsers[roomId]) {
        roomUsers[roomId] = roomUsers[roomId].filter(
          (user) => user !== username
        );
        io.to(roomId).emit("userList", roomUsers[roomId]); // Broadcast updated user list to the room
        io.to(roomId).emit("roomMessage", `${username} has left the room`); // Broadcast user left message to the room
      }
      console.log(`${username} disconnected from room: ${roomId}`);
    }
  });
});

// ==========================

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
