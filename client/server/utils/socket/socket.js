// socketHandler.js
const onlineUsers = new Map();

module.exports = function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user
    socket.on('register_user', (userId) => {
      const userIdStr = String(userId);

      // Store user ID in socket for later use
      socket.userId = userIdStr;

      // Store socket connection info
      onlineUsers.set(userIdStr, {
        socketId: socket.id,
        status: 'online',
        lastSeen: new Date(),
      });

      // Join user to their personal room for private messages
      socket.join(`user_${userIdStr}`);

      // Notify others this user came online
      socket.broadcast.emit('user_status_changed', {
        user_id: userIdStr,
        status: 'online',
        lastSeen: null,
      });

      console.log(`User ${userIdStr} registered with socket ${socket.id}`);
    });

    // Join a chat room
    socket.on('join_room', (roomId) => {
      socket.join(`room_${roomId}`);
      console.log(`User ${socket.userId} joined room: ${roomId}`);
    });

    // Leave a chat room
    socket.on('leave_room', (roomId) => {
      socket.leave(`room_${roomId}`);
      console.log(`User ${socket.userId} left room: ${roomId}`);
    });

    // Send message to a room
    socket.on('send_message', async (messageData) => {
      try {
        const { room_id, content, sender_id } = messageData;

        console.log('Message received:', messageData);

        // Save to database first (you'll need to implement this)
        // const savedMessage = await saveMessageToDatabase(messageData);

        // Broadcast to all users in the room including sender
        io.to(`room_${room_id}`).emit('private_message', messageData);

        // Also send confirmation to sender
        socket.emit('message_sent', { ...messageData, status: 'sent' });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('user_typing', (data) => {
      const { room_id, user_id, typing } = data;
      socket.to(`room_${room_id}`).emit('user_typing', {
        user_id,
        typing,
        room_id,
      });
    });

    // Message read receipt
    socket.on('mark_message_read', async (data) => {
      try {
        const { message_id, room_id, user_id } = data;

        // Notify other users in the room
        const readReceipt = {
          message_id,
          room_id,
          reader_id: user_id,
          read_at: new Date(),
        };

        io.to(`room_${room_id}`).emit('message_read', readReceipt);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Get online status
    socket.on('get_online_status', (userId) => {
      const status = onlineUsers.get(String(userId));
      socket.emit('user_online_status', {
        user_id: userId,
        status: status ? status.status : 'offline',
        lastSeen: status ? status.lastSeen : null,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id, socket.userId);

      if (socket.userId) {
        // Update user status to offline
        onlineUsers.set(socket.userId, {
          status: 'offline',
          lastSeen: new Date(),
        });

        // Notify others this user went offline
        io.emit('user_status_changed', {
          user_id: socket.userId,
          status: 'offline',
          lastSeen: new Date(),
        });

        onlineUsers.delete(socket.userId);
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return onlineUsers;
};
