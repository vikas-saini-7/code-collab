const registerCodeHandlers = (io, socket) => {
   // When user changes code in the editor
  socket.on("change-code", ({ fileId, code, username, roomId }) => {
    console.log(`Code change in room ${roomId}, file ${fileId} by ${username}`);
    // Broadcast the code change to all users in the specific room
    io.emit("change-code", { fileId, code, username });
  });
};

module.exports = registerCodeHandlers;