const { roomUsers } = require('../store');

const registerChatHandlers = (io, socket) => {
  // When a user sends a message
  socket.on("chatMessage", ({ roomId, username, message }) => {
    // if (roomUsers[roomId]) {
    //   console.log("Message sent to room:", roomId);
    //   io.to(roomId).emit("chatMessage", { username, message });
    // } else {
    //   console.log("Room not found or empty:", roomId);
    // }
  });
};

module.exports = registerChatHandlers;