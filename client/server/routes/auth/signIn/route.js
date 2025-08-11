const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const connection = require('../../../models/dbConnection');
const { verifyToken } = require('../../../middlewares/auth/auth');

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.error('FATAL: JWT secret key not configured');
  process.exit(1);
}

// Helper function for database queries
const query = async (sql, params) => {
  try {
    const [results] = await connection.promise().query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// User verification endpoint
router.get('/user/:user_id', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const tokenUserId = req?.user?.user_id;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (user_id !== tokenUserId) {
      return res.status(403).json({
        message: 'Unauthorized access',
        details: 'Token does not match requested user',
      });
    }

    const user = await query('SELECT * FROM users WHERE user_id = ? LIMIT 1', [user_id]);

    return res.json({
      exists: user.length > 0,
      user: user[0] || null,
    });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// User registration endpoint
router.post('/sign-in', async (req, res) => {
  try {
    const { username, phone, profile_picture, status = 'active', role = 'user' } = req.body;

    if (!username || !phone) {
      return res.status(400).json({
        message: 'Username and phone are required',
        fields: { username: !username, phone: !phone },
      });
    }

    const id = uuidv4();
    const user_id = uuidv4();
    const now = new Date();
    const token = jwt.sign({ user_id: user_id, role: role }, SECRET_KEY, { expiresIn: '30d' });

    await query(
      `INSERT INTO users 
      (id, user_id, username, phone, profile_picture, status, role, created_at, updated_at, token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, username, phone, profile_picture || null, status, role, now, now, token]
    );

    res.status(201).json({ message: 'User registered successfully', user_id, token, expiresIn: '30d' });
  } catch (error) {
    console.error('Error registering user:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'User already exists',
        field: error.message.includes('phone') ? 'phone' : 'username',
      });
    }

    res.status(500).json({
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
