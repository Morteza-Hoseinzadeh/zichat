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

// Get user's private chat list
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;

    const query_text = `
      SELECT 
         room.id as room_id,
         CASE 
             WHEN room.user1_id = ? THEN room.user2_id
             ELSE room.user1_id
         END as other_user_id,
         other_user.username as other_username,
         other_user.profile_picture as other_profile_picture,
         other_user.status as other_user_status,

         pm.content as last_message,
         pm.created_at as last_message_time,
         pm.sender_id as last_message_sender_id,

         CASE 
             WHEN pm.sender_id = ? THEN true
             ELSE false
         END as is_last_message_from_me,

         -- وضعیت خوانده شدن پیام
         CASE 
             WHEN pm.sender_id = ? THEN 
                 CASE 
                     WHEN ms.is_read = 1 THEN 'read'
                     ELSE 'sent'
                 END
             ELSE 
                 CASE 
                     WHEN ms.is_read = 1 THEN 'read_by_me'
                     ELSE 'unread'
                 END
         END as message_status,

         ms.read_at as read_at,

         COALESCE(
           (SELECT COUNT(*) 
            FROM zichat.message_read_status ms2 
            INNER JOIN zichat.private_messages pm2 ON ms2.message_id = pm2.chat_id
            WHERE pm2.room_id = room.id 
            AND ms2.user_id = ?
            AND ms2.is_read = 0),
           0
         ) as unread_count,

         -- اطلاعات اضافی درباره آخرین پیام
         pm.chat_id as last_message_id,
         pm.edited as is_last_message_edited

       FROM zichat.private_rooms room
       INNER JOIN zichat.users other_user ON (
           other_user.user_id = CASE 
               WHEN room.user1_id = ? THEN room.user2_id
               ELSE room.user1_id
           END
       )
       LEFT JOIN (
         SELECT room_id, chat_id, content, created_at, sender_id, edited,
                ROW_NUMBER() OVER (PARTITION BY room_id ORDER BY created_at DESC) as rn
         FROM zichat.private_messages
       ) pm ON room.id = pm.room_id AND pm.rn = 1
       LEFT JOIN zichat.message_read_status ms ON (
         ms.message_id = pm.chat_id 
         AND ms.user_id = ?
       )
       WHERE room.user1_id = ? 
          OR room.user2_id = ?
       ORDER BY COALESCE(pm.created_at, room.created_at) DESC;
    `;

    // روش صحیح دریافت نتیجه
    const results = await query(query_text, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id]);

    // بسته به نوع درایور، ممکنه results آرایه‌ای از نتایج باشه
    const chats = Array.isArray(results) ? results : results[0] || [];

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

    if (!roomId || !content) {
      return res.status(400).json({ error: 'Room ID and content are required' });
    }

    // Verify user has access to this room and get participants
    const [room] = await connection.promise().query('SELECT user1_id, user2_id FROM private_rooms WHERE id = ? AND (user1_id = ? OR user2_id = ?)', [roomId, user_id, user_id]);

    if (room.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const otherUserId = room[0].user1_id === user_id ? room[0].user2_id : room[0].user1_id;
    const chatId = uuidv4();
    const currentTime = new Date();

    // Insert message
    const [insertResult] = await connection.promise().query('INSERT INTO private_messages (chat_id, room_id, sender_id, content, edited, created_at) VALUES (?, ?, ?, ?, ?, ?)', [chatId, roomId, user_id, content, 0, currentTime]);

    if (insertResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to insert message' });
    }

    // Get the inserted message
    const [messages] = await connection.promise().query(
      `
      SELECT 
        pm.chat_id as message_id,
        pm.room_id,
        pm.sender_id,
        pm.content,
        pm.edited as is_edited,
        pm.created_at,
        pm.updated_at,
        u.username as sender_username,
        u.profile_picture as sender_avatar,
        u.status as sender_status
      FROM private_messages pm
      JOIN users u ON pm.sender_id = u.user_id
      WHERE pm.chat_id = ?
      `,
      [chatId]
    );

    if (messages.length === 0) {
      return res.status(404).json({ error: 'Message not found after insertion' });
    }

    const message = messages[0];

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`${otherUserId}`).emit('private_message', message);
      io.to(`room_${roomId}`).emit('private_message', message);
    }

    res.json({
      status: 200,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Error sending private message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message,
    });
  }
});

// Get private messages with enhanced data
router.get('/private-messages/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user_id } = req.user;

    // Verify user has access to this room with better error handling
    const [roomResult] = await connection.promise().query(
      `SELECT id, user1_id, user2_id 
       FROM private_rooms 
       WHERE id = ? AND (user1_id = ? OR user2_id = ?)`,
      [roomId, user_id, user_id]
    );

    if (roomResult.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    const room = roomResult[0];

    // Get the other user's information
    const otherUserId = room.user1_id === user_id ? room.user2_id : room.user1_id;

    const [otherUserResult] = await connection.promise().query(
      `SELECT user_id, username, profile_picture, status 
       FROM users 
       WHERE user_id = ?`,
      [otherUserId]
    );

    if (otherUserResult.length === 0) {
      return res.status(404).json({ error: 'Other user not found' });
    }

    const otherUser = otherUserResult[0];

    // Get messages with enhanced sender info and read status
    const [messages] = await connection.promise().query(
      `
      SELECT 
        pm.chat_id as message_id,
        pm.room_id,
        pm.sender_id,
        pm.content,
        pm.edited as is_edited,
        pm.created_at,
        pm.updated_at,
        pm.reciever_username,
        pm.reciever_profile_picture,
        u.username as sender_username,
        u.profile_picture as sender_avatar,
        u.status as sender_status,
        mrs.is_read,
        mrs.read_at,
        CASE 
          WHEN pm.sender_id = ? THEN TRUE
          ELSE FALSE
        END as is_sent_by_me,
        CASE 
          WHEN pm.sender_id = ? THEN 
            CASE 
              WHEN mrs.is_read = 1 THEN 'read'
              ELSE 'sent'
            END
          ELSE 
            CASE 
              WHEN mrs.is_read = 1 THEN 'read_by_me'
              ELSE 'unread'
            END
        END as message_status
      FROM private_messages pm
      JOIN users u ON pm.sender_id = u.user_id
      LEFT JOIN message_read_status mrs ON pm.chat_id = mrs.message_id AND mrs.user_id = ?
      WHERE pm.room_id = ?
      ORDER BY pm.created_at ASC
      `,
      [user_id, user_id, user_id, roomId]
    );

    // Mark received messages as read
    await connection.promise().query(
      `
      INSERT INTO message_read_status (message_id, user_id, is_read, read_at)
      SELECT pm.chat_id, ?, TRUE, NOW() 
      FROM private_messages pm
      WHERE pm.room_id = ? AND pm.sender_id != ?
      ON DUPLICATE KEY UPDATE is_read = TRUE, read_at = NOW()
      `,
      [user_id, roomId, user_id]
    );

    // Prepare response with all needed data
    const response = {
      room_info: {
        room_id: roomId,
        other_user: {
          user_id: otherUser.user_id,
          username: otherUser.username,
          profile_picture: otherUser.profile_picture,
          status: otherUser.status,
        },
      },
      messages: messages,
      total_messages: messages.length,
      unread_count: messages.filter((m) => !m.is_read && !m.is_sent_by_me).length,
    };

    res.json({
      status: 200,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching private messages:', error);
    res.status(500).json({
      error: 'Failed to fetch messages',
      message: error.message,
    });
  }
});

// Mark message as read
router.post('/message-read', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { message_id, room_id } = req.body;

    if (!message_id || !room_id) {
      return res.status(400).json({ error: 'Message ID and Room ID are required' });
    }

    // Verify user has access to this room
    const [room] = await connection.promise().query('SELECT id FROM private_rooms WHERE id = ? AND (user1_id = ? OR user2_id = ?)', [room_id, user_id, user_id]);

    if (room.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    // Verify message exists in this room
    const [message] = await connection.promise().query('SELECT chat_id FROM private_messages WHERE chat_id = ? AND room_id = ?', [message_id, room_id]);

    if (message.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Update message read status
    const [result] = await connection.promise().query(
      `INSERT INTO message_read_status (message_id, user_id, is_read, read_at) 
       VALUES (?, ?, TRUE, NOW()) 
       ON DUPLICATE KEY UPDATE is_read = TRUE, read_at = NOW()`,
      [message_id, user_id]
    );

    // Get the other participant in this private chat
    const [participants] = await connection.promise().query('SELECT user1_id, user2_id FROM private_rooms WHERE id = ?', [room_id]);

    const otherUserId = participants[0].user1_id === user_id ? participants[0].user2_id : participants[0].user1_id;

    // Prepare read receipt data
    const readReceipt = {
      message_id: message_id,
      room_id: room_id,
      reader_id: user_id,
      read_at: new Date(),
    };

    // Emit socket event to notify the sender
    const io = req.app.get('io');
    io.to(`user_${otherUserId}`).emit('message_read_receipt', readReceipt);
    io.to(`room_${room_id}`).emit('message_read_receipt', readReceipt);

    res.json({
      status: 200,
      message: 'Message marked as read',
      data: readReceipt,
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      error: 'Failed to mark message as read',
      message: error.message,
    });
  }
});

// Mark multiple messages as read
router.post('/messages-read', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { message_ids, room_id } = req.body;

    if (!message_ids || !Array.isArray(message_ids) || message_ids.length === 0 || !room_id) {
      return res.status(400).json({ error: 'Message IDs array and Room ID are required' });
    }

    // Verify user has access to this room
    const [room] = await connection.promise().query('SELECT id FROM private_rooms WHERE id = ? AND (user1_id = ? OR user2_id = ?)', [room_id, user_id, user_id]);

    if (room.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    // Verify messages exist in this room
    const placeholders = message_ids.map(() => '?').join(',');
    const [messages] = await connection.promise().query(
      `SELECT chat_id FROM private_messages 
       WHERE chat_id IN (${placeholders}) AND room_id = ?`,
      [...message_ids, room_id]
    );

    if (messages.length !== message_ids.length) {
      return res.status(404).json({ error: 'Some messages not found' });
    }

    // Update multiple messages read status
    const updatePromises = message_ids.map((message_id) =>
      connection.promise().query(
        `INSERT INTO message_read_status (message_id, user_id, is_read, read_at) 
         VALUES (?, ?, TRUE, NOW()) 
         ON DUPLICATE KEY UPDATE is_read = TRUE, read_at = NOW()`,
        [message_id, user_id]
      )
    );

    await Promise.all(updatePromises);

    // Get the other participant
    const [participants] = await connection.promise().query('SELECT user1_id, user2_id FROM private_rooms WHERE id = ?', [room_id]);

    const otherUserId = participants[0].user1_id === user_id ? participants[0].user2_id : participants[0].user1_id;

    // Prepare read receipts
    const readReceipts = message_ids.map((message_id) => ({
      message_id: message_id,
      room_id: room_id,
      reader_id: user_id,
      read_at: new Date(),
    }));

    // Emit socket events
    const io = req.app.get('io');
    readReceipts.forEach((receipt) => {
      io.to(`user_${otherUserId}`).emit('message_read_receipt', receipt);
      io.to(`room_${room_id}`).emit('message_read_receipt', receipt);
    });

    res.json({
      status: 200,
      message: 'Messages marked as read',
      data: {
        count: message_ids.length,
        receipts: readReceipts,
      },
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      error: 'Failed to mark messages as read',
      message: error.message,
    });
  }
});

// Get read status for multiple messages
router.get('/messages-read-status', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { message_ids } = req.query;

    if (!message_ids) {
      return res.status(400).json({ error: 'Message IDs are required' });
    }

    const messageIdsArray = Array.isArray(message_ids) ? message_ids : [message_ids];

    const placeholders = messageIdsArray.map(() => '?').join(',');
    const [readStatus] = await connection.promise().query(
      `SELECT message_id, user_id, is_read, read_at 
       FROM message_read_status 
       WHERE message_id IN (${placeholders}) AND user_id = ?`,
      [...messageIdsArray, user_id]
    );

    res.json({
      status: 200,
      data: readStatus,
    });
  } catch (error) {
    console.error('Error fetching read status:', error);
    res.status(500).json({
      error: 'Failed to fetch read status',
      message: error.message,
    });
  }
});

// Get unread messages count for a room
router.get('/unread-count/:roomId', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { roomId } = req.params;

    // Verify user has access to this room
    const [room] = await connection.promise().query('SELECT id FROM private_rooms WHERE id = ? AND (user1_id = ? OR user2_id = ?)', [roomId, user_id, user_id]);

    if (room.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    const [unreadCount] = await connection.promise().query(
      `SELECT COUNT(*) as count 
       FROM private_messages pm
       LEFT JOIN message_read_status mrs ON pm.chat_id = mrs.message_id AND mrs.user_id = ?
       WHERE pm.room_id = ? AND pm.sender_id != ? AND (mrs.is_read IS NULL OR mrs.is_read = 0)`,
      [user_id, roomId, user_id]
    );

    res.json({
      status: 200,
      data: { room_id: roomId, unread_count: unreadCount[0].count },
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      error: 'Failed to fetch unread count',
      message: error.message,
    });
  }
});

module.exports = router;
