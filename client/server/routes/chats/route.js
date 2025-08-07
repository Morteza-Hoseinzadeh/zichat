const express = require('express');
const router = express.Router();

// Check if user is online
router.get('/check-status/:userId', (req, res) => {
  const { userId } = req.params;
  const socketMap = req.app.get('socketMap');

  const isOnline = socketMap.has(String(userId));
  res.json({ online: isOnline });
});

// Send a message to a room
router.post('/send', (req, res) => {
  const { room, message, senderId } = req.body;
  const io = req.app.get('io');

  io.to(room).emit('receive_message', { senderId, message });
  res.json({ status: 'sent' });
});

// Edit a message (emit event)
router.put('/edit', (req, res) => {
  const { messageId, newContent, room } = req.body;
  const io = req.app.get('io');

  io.to(room).emit('edit_message', { messageId, newContent });
  res.json({ status: 'edited' });
});

// Join a room (force user socket to join)
router.post('/join-room', (req, res) => {
  const { userId, room } = req.body;
  const socketMap = req.app.get('socketMap');

  const socket = socketMap.get(userId);
  if (socket) {
    socket.join(room);
    res.json({ status: 'joined', room });
  } else {
    res.status(404).json({ error: 'User is offline' });
  }
});

module.exports = router;
