// Central store for socket-related state
const activeUsers = {};
const roomUsers = {};

const setUserActive = (socketId, username, roomId) => {
  // activeUsers[socketId] = { username, roomId };
};

const removeUser = (socketId, io) => {
  // const user = activeUsers[socketId];
  // if (user) {
  //   const { username, roomId } = user;
  //   delete activeUsers[socketId];

  //   if (roomUsers[roomId]) {
  //     roomUsers[roomId] = roomUsers[roomId].filter(
  //       (user) => user !== username
  //     );
  //     io.to(roomId).emit("userList", roomUsers[roomId]);
  //     io.to(roomId).emit("roomMessage", `${username} has left the room`);
  //   }
  //   console.log(`${username} disconnected from room: ${roomId}`);
  // }
};

module.exports = {
  activeUsers,
  roomUsers,
  setUserActive,
  removeUser
};