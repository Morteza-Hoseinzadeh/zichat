const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || '942691ec528167ae3fedbb03d573370d473ad532f9465976d1ccf320f4a3fa6x';

const connection = require('../../models/dbConnection');

router.get('/check-user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    connection.query('SELECT * FROM zichat.users WHERE user_id = ? LIMIT 1', [user_id], (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        return res.json({ exists: true, user: results[0] });
      } else {
        return res.json({ exists: false });
      }
    });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, phone, profile_picture, status = 'active', role = 'user' } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: 'Username and phone are required' });
    }

    const id = uuidv4();
    const user_id = uuidv4();
    const now = new Date();
    const token = jwt.sign({ user_id }, SECRET_KEY, { expiresIn: '365d' });

    // Remove the id from INSERT and let it auto-increment
    connection.query('INSERT INTO users (id, user_id, username, phone, profile_picture, status, role, token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, user_id, username, phone, profile_picture || null, status, role, token, now, now], (err, results) => {
      if (err) {
        console.error('DB Insert Error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ message: 'User registered successfully', id: results.insertId, user_id, token });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
