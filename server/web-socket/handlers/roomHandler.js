const { activeUsers, roomUsers, setUserActive } = require('../store');

const registerRoomHandlers = (io, socket) => {
  // When a user joins a room
  socket.on("join-room", ({ username, roomId }) => {
    // socket.join(roomId);
    // setUserActive(socket.id, username, roomId);
    
    // if (!roomUsers[roomId]) {
    //   roomUsers[roomId] = [];
    // }
    // roomUsers[roomId].push(username);

    // console.log(`${username} joined room: ${roomId}`);
    // io.to(roomId).emit("userList", roomUsers[roomId]);
    // io.to(roomId).emit("roomMessage", `${username} has joined the room`);
  });
  
  // Room settings updates
  socket.on("update-settings", ({ roomId, settings }) => {
    // io.to(roomId).emit("roomSettingsUpdate", settings);
  });
};

module.exports = registerRoomHandlers;