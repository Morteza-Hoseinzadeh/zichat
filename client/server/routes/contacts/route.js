const express = require('express');
const router = express.Router();
const { connection } = require('../../models/dbConnection');
const { v4: uuidv4 } = require('uuid');

router.post('/add', async (req, res) => {
  try {
    const { user_id, contact_name, contact_phone, contact_email, avatar_url } = req.body;

    if (!user_id || !contact_name || !contact_phone) {
      return res.status(400).json({ error: 'user_id, contact_name, and contact_phone are required' });
    }

    // Check if contact_phone exists in users table
    const [userRows] = await connection.promise().query('SELECT id FROM users WHERE phone = ? LIMIT 1', [contact_phone]);

    const is_registered = userRows.length > 0 ? 1 : 0;

    const contactId = uuidv4();

    const sql = `
      INSERT INTO contacts 
      (id, user_id, contact_name, contact_phone, contact_email, avatar_url, is_registered, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await connection.promise().query(sql, [contactId, user_id, contact_name, contact_phone, contact_email || null, avatar_url || null, is_registered]);

    res.json({ success: true, message: 'Contact added successfully', id: contactId, is_registered });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
