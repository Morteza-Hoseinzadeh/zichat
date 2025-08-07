const socketMap = new Map();

module.exports = function socketHandler(io) {
  io.on('connection', (socket) => {
    // Expect frontend to emit `register_user` on connect
    socket.on('register_user', (userId) => {
      socketMap.set(String(userId), socket);
    });

    socket.on('disconnect', () => {
      for (const [userId, s] of socketMap.entries()) {
        if (s.id === socket.id) {
          socketMap.delete(userId);
          break;
        }
      }
    });
  });

  return socketMap; // return map for use in routes
};
