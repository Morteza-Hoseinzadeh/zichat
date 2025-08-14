// routes/contacts.js
const express = require('express');
const router = express.Router();

const connection = require('../../models/dbConnection');
const { verifyToken } = require('../../middlewares/auth/auth');

// Get all contacts for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const [contacts] = await connection.promise().query('SELECT id, contact_name, phone_number, avatar_url FROM zichat.contacts WHERE user_id = ?', [user_id]);
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new contacts
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ message: 'Invalid contacts data' });
    }

    const values = contacts.map((contact) => [user_id, contact.name || 'Unknown', contact.phone_number, contact.avatar_url || null]);

    await connection.promise().query('INSERT INTO zichat.contacts (user_id, contact_name, phone_number, avatar_url) VALUES ?', [values]);

    res.json({ message: 'Contacts added successfully' });
  } catch (error) {
    console.error('Error adding contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id } = req.params;

    const [result] = await connection.promise().query('DELETE FROM zichat.contacts WHERE id = ? AND user_id = ?', [id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
