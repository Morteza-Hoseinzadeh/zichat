const express = require('express');
const router = express.Router();
const { connection } = require('../../models/dbConnection');
const { v4: uuidv4 } = require('uuid');

router.get('/check-user/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    connection.query('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone], (err, results) => {
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
    const { username, phone, profile_picture, status = 'active' } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: 'Username and phone are required' });
    }

    const id = uuidv4();
    const now = new Date();

    connection.query('INSERT INTO users (id, username, phone, profile_picture, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, username, phone, profile_picture || null, status, now, now], (err) => {
      if (err) {
        console.error('DB Insert Error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ message: 'User registered successfully', id });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
