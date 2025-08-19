const socketMap = new Map(); // userId -> socket

module.exports = function socketHandler(io) {
  io.on('connection', (socket) => {
    // Register user
    socket.on('register_user', (userId) => {
      const userIdStr = String(userId);

      if (!socketMap.has(userIdStr)) {
        socketMap.set(userIdStr, new Set());
      }
      socketMap.get(userIdStr).add(socket);

      // Notify others this user came online
      socket.broadcast.emit('user_online', userIdStr);
    });

    // Join a chat room
    socket.on('join_room', (roomId) => {
      socket.join(`room_${roomId}`);
      console.log(`User joined room: ${roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
      for (const [userId, s] of socketMap.entries()) {
        if (s.id === socket.id) {
          socketMap.delete(userId);
          // Notify others this user went offline
          io.emit('user_status', {
            userId,
            isOnline: false,
          });
          break;
        }
      }
    });
  });

  return socketMap;
};
