const express = require('express');
const router = express.Router();
const connection = require('../../models/dbConnection');

const { verifyToken } = require('../../middlewares/auth/auth');
const { v4: uuidv4 } = require('uuid');

const query = async (sql, params) => {
  try {
    const [results] = await connection.promise().query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Check if user is online
router.get('/check-status/:userId', verifyToken, (req, res) => {
  const socketMap = req.app.get('socketMap');
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const isOnline = socketMap.has(String(userId)) && socketMap.get(String(userId)).size > 0;

  res.json({
    online: isOnline,
    connectionCount: isOnline ? socketMap.get(String(userId)).size : 0,
  });
});

// Get user's contacts for private chats
router.get('/contacts', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;

    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.profile_picture,
        u.status,
        u.phone,
        EXISTS (
          SELECT 1 FROM private_rooms pr 
          WHERE (pr.user1_id = ? AND pr.user2_id = u.user_id) 
          OR (pr.user1_id = u.user_id AND pr.user2_id = ?)
        ) as has_existing_chat
      FROM users u
      WHERE u.user_id != ?
      ORDER BY u.username
    `;

    const [contacts] = await connection.promise().query(query, [user_id, user_id, user_id]);

    res.json({ status: 200, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
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

// Get user's private chat list
router.get('/list', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;

    const query = `
      SELECT 
      room.id as room_id,
      CASE 
          WHEN room.user1_id = ? THEN room.user2_id
          ELSE room.user1_id
      END as other_user_id,
      other_user.username as other_username,
      other_user.profile_picture as other_profile_picture,
      other_user.status as other_user_status,
      (SELECT content 
       FROM zichat.private_messages 
       WHERE room_id = room.id 
       ORDER BY created_at DESC 
       LIMIT 1) as last_message,
      (SELECT created_at 
       FROM zichat.private_messages 
       WHERE room_id = room.id 
       ORDER BY created_at DESC 
       LIMIT 1) as last_message_time,
      (SELECT COUNT(*) 
       FROM zichat.message_read_status ms 
       INNER JOIN zichat.private_messages pm ON ms.message_id = pm.chat_id
       WHERE pm.room_id = room.id 
       AND ms.user_id = '2efc1555-9fab-416e-9fa3-24b668ac670c'
       AND ms.is_read = 0) as unread_count
      FROM zichat.private_rooms room
      INNER JOIN zichat.users other_user ON (
          other_user.user_id = CASE 
              WHEN room.user1_id = ? THEN room.user2_id
              ELSE room.user1_id
          END
      )
      WHERE room.user1_id = ? 
         OR room.user2_id = ?
      ORDER BY last_message_time DESC;
    `;

    const [chats] = await connection.promise().query(query, [user_id, user_id, user_id, user_id]);

    res.json({ status: 200, data: { type: 'private', list: chats } });
  } catch (error) {
    console.error('Error fetching private chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or get private chat room
router.post('/private-room', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ error: 'Other user ID is required' });
    }

    // Ensure user1_id is always the smaller ID to prevent duplicate rooms
    const user1_id = user_id < otherUserId ? user_id : otherUserId;
    const user2_id = user_id < otherUserId ? otherUserId : user_id;

    // Check if room already exists
    const [existingRooms] = await connection.promise().query('SELECT id FROM private_rooms WHERE user1_id = ? AND user2_id = ?', [user1_id, user2_id]);

    if (existingRooms.length > 0) {
      return res.json({ roomId: existingRooms[0].id });
    }

    // Create new room
    const [result] = await connection.promise().query('INSERT INTO private_rooms (id, user1_id, user2_id, created_at) VALUES (?, ?, ?, ?)', [uuidv4(), user1_id, user2_id, new Date()]);

    res.json({ roomId: result.insertId });
  } catch (error) {
    console.error('Error creating private room:', error);
    res.status(500).json({ error: 'Failed to create private chat room' });
  }
});

// Send private message
router.post('/private-messages', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { roomId, content } = req.body;

    // Verify user has access to this room
    const [room] = await connection.promise().query('SELECT id FROM private_rooms WHERE id = ? AND (user1_id = ? OR user2_id = ?)', [roomId, user_id, user_id]);

    if (room.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Insert message
    const [result] = await connection.promise().query('INSERT INTO private_messages (chat_id, room_id, sender_id, content) VALUES (?, ?, ?, ?)', [uuidv4(), roomId, user_id, content]);

    // Get the full message with sender info
    const [messages] = await connection.promise().query(
      `
      SELECT 
        m.*, 
        u.username as sender_name,
        u.profile_picture as sender_avatar
      FROM private_messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.id = ?
    `,
      [result.insertId]
    );

    const message = messages[0];

    // Get the other participant in this private chat
    const [participants] = await connection.promise().query('SELECT user1_id, user2_id FROM private_rooms WHERE id = ?', [roomId]);

    const otherUserId = participants[0].user1_id === user_id ? participants[0].user2_id : participants[0].user1_id;

    // Emit socket event
    const io = req.app.get('io');
    io.to(`user_${otherUserId}`).emit('private_message', message);
    io.to(`room_${roomId}`).emit('private_message', message);

    res.json(message);
  } catch (error) {
    console.error('Error sending private message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get private messages
router.get('/private-messages/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user_id } = req.user;

    // Verify user has access to this room
    const [room] = await connection.promise().query('SELECT id FROM private_rooms WHERE id = ? AND (user1_id = ? OR user2_id = ?)', [roomId, user_id, user_id]);

    if (room.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get messages with sender info
    const [messages] = await connection.promise().query(
      `
      SELECT 
        m.*, 
        u.username as sender_name,
        u.profile_picture as sender_avatar,
        rs.is_read as is_read
      FROM private_messages m
      JOIN users u ON m.sender_id = u.user_id
      LEFT JOIN message_read_status rs ON m.id = rs.message_id AND rs.user_id = ?
      WHERE m.room_id = ?
      ORDER BY m.created_at ASC
    `,
      [user_id, roomId]
    );

    // Mark messages as read
    await connection.promise().query(
      `
      INSERT INTO message_read_status (message_id, user_id, is_read, read_at)
      SELECT id, ?, TRUE, NOW() 
      FROM private_messages 
      WHERE room_id = ? AND sender_id != ?
      ON DUPLICATE KEY UPDATE is_read = TRUE, read_at = NOW()
    `,
      [user_id, roomId, user_id]
    );

    res.json(messages);
  } catch (error) {
    console.error('Error fetching private messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
