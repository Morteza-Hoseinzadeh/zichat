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

    return res.json({ exists: user.length > 0, user: user[0] || null });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// User sign-in endpoint (handles both registration and login)
router.post('/sign-in', async (req, res) => {
  try {
    const { username, phone, profile_picture = '', status = 'active', role = 'user' } = req.body;

    // 1. Only phone is required
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // 2. Check if user exists (phone only)
    const [user] = await query(`SELECT user_id, role FROM users WHERE phone = ? LIMIT 1`, [phone]);

    const now = new Date();
    let user_id, token;

    // 3. EXISTING USER → Update token & timestamp
    if (user) {
      user_id = user.user_id;
      token = jwt.sign({ user_id, role: user.role || role }, SECRET_KEY, { expiresIn: '30d' });

      await query(`UPDATE users SET token = ?, updated_at = ? WHERE phone = ?`, [token, now, phone]);

      return res.status(200).json({ success: true, user_id, token, expiresIn: '30d' });
    }

    // 4. NEW USER → Insert (no duplicate checks)
    user_id = uuidv4();
    token = jwt.sign({ user_id, role }, SECRET_KEY, { expiresIn: '30d' });

    await query(
      `INSERT INTO users 
      (user_id, username, phone, profile_picture, status, role, created_at, updated_at, token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, username, phone, profile_picture || null, status, role, now, now, token]
    );

    return res.status(201).json({
      success: true,
      user_id,
      token,
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
});

module.exports = router;
