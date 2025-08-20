// socketHandler.js
const socketMap = new Map();

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

        // Save to database (you'll need to implement this)
        // const savedMessage = await saveMessageToDatabase(messageData);

        // Broadcast to all users in the room except sender
        socket.to(`room_${room_id}`).emit('receive_message', messageData);

        // Also send to sender for confirmation
        socket.emit('message_sent', { ...messageData, status: 'sent' });

        // Notify users about new message (for badge counts)
        io.to(`room_${room_id}`).emit('new_message_notification', {
          room_id,
          message_count: 1,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing_start', (data) => {
      const { room_id, user_id } = data;
      socket.to(`room_${room_id}`).emit('user_typing', {
        user_id,
        typing: true,
      });
    });

    socket.on('typing_stop', (data) => {
      const { room_id, user_id } = data;
      socket.to(`room_${room_id}`).emit('user_typing', {
        user_id,
        typing: false,
      });
    });

    // Message read receipt
    socket.on('message_read', async (data) => {
      try {
        const { message_id, room_id, user_id } = data;

        // Update in database
        // await markMessageAsRead(message_id, user_id);

        // Notify sender that message was read
        const readReceipt = {
          message_id,
          room_id,
          reader_id: user_id,
          read_at: new Date(),
        };

        io.to(`room_${room_id}`).emit('message_read_receipt', readReceipt);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id, socket.userId);

      if (socket.userId) {
        // Remove socket from map
        const userSockets = socketMap.get(socket.userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            socketMap.delete(socket.userId);
            // Notify others this user went offline
            io.emit('user_offline', socket.userId);
          }
        }
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return socketMap;
};
