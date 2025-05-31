const registerCodeHandlers = (io, socket) => {
  // When user changes code in the editor
  socket.on("changeCode", ({ fileId, code, username, roomId }) => {
    console.log(fileId, code, username, roomId);
    // io.to(roomId).emit("changeCode", { fileId, code, username });
  });
};

module.exports = registerCodeHandlers;