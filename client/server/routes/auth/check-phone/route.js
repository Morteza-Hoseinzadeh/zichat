const express = require('express');
const router = express.Router();
const connection = require('../../../models/dbConnection');

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

router.get('/check-phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    const user = await query('SELECT * FROM zichat.users WHERE phone = ? LIMIT 1', [phone]);

    return res.json({ exists: user.length > 0, user: user[0] || null });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
