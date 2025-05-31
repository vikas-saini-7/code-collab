const registerUiHandlers = (io, socket) => {
  // Handle tooltip display events
  socket.on("showTooltip", (data) => {
    // const { roomId, text, position } = data;
    // io.to(roomId).emit("showTooltip", { text, position });
  });
};

module.exports = registerUiHandlers;