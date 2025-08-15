// routes/contacts.js
const express = require('express');
const router = express.Router();

const connection = require('../../models/dbConnection');
const { verifyToken } = require('../../middlewares/auth/auth');

const query = async (sql, params) => {
  try {
    const [results] = await connection.promise().query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

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

// Check multiple phone numbers against contacts
router.post('/check-users', verifyToken, async (req, res) => {
  try {
    const { phone_numbers } = req.body;
    const userId = req.user?.user_id;

    // Validate input
    if (!Array.isArray(phone_numbers) || phone_numbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'phone_numbers array is required',
      });
    }

    // Validate each phone number format (10 digits exactly)
    const invalidNumbers = phone_numbers.filter((phone) => !/^\d{10}$/.test(phone));
    if (invalidNumbers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Phone numbers must be 10 digits',
        invalidNumbers,
      });
    }

    // Check which numbers are app users
    const [appUsers = []] =
      (await query(
        `SELECT phone, id, username, profile_picture 
       FROM users 
       WHERE phone IN (?)`,
        [phone_numbers]
      )) || [];

    // Check which numbers exist in contacts
    const [existingContacts = []] =
      (await query(
        `SELECT phone_number, contact_name, id 
       FROM contacts 
       WHERE user_id = ? AND phone_number IN (?)`,
        [userId, phone_numbers]
      )) || [];

    // Create lookup maps with proper initialization
    const appUserMap = new Map();
    const contactMap = new Map();

    // Populate the maps safely
    [appUsers].forEach((user) => {
      if (user?.phone) {
        appUserMap.set(user.phone, user);
      }
    });

    [existingContacts].forEach((contact) => {
      if (contact?.phone_number) {
        contactMap.set(contact.phone_number, contact);
      }
    });

    // Prepare response
    const results = phone_numbers.map((phone) => ({
      phone_number: phone,
      is_app_user: appUserMap.has(phone),
      exists_in_contacts: contactMap.has(phone),
      user_details: appUserMap.get(phone) || null,
      contact_details: contactMap.get(phone) || null,
    }));

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error bulk checking users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
