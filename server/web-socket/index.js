const socketIo = require("socket.io");
const { setUserActive, removeUser } = require("./store");
const registerRoomHandlers = require("./handlers/roomHandler");
const registerChatHandlers = require("./handlers/chatHandler");
const registerCodeHandlers = require("./handlers/codeHandler");
const registerUiHandlers = require("./handlers/uiHandler");

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://realtime-code-collab.vercel.app",
        "*",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Registering handlers to use socket events
    console.log("A user connected:", socket.id);
    
    // Set user as active
    registerRoomHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerCodeHandlers(io, socket);
    registerUiHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      removeUser(socket.id, io);
    });
  });

  return io;
};

module.exports = initializeSocket;