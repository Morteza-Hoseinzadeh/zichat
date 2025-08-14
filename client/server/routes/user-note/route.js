const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/auth/auth');
const connection = require('../../models/dbConnection');

const query = async (sql, params) => {
  try {
    const [results] = await connection.promise().query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

router.post('/:user_id/add', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { note } = req.body;

    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    const add_note_query = await query(`UPDATE zichat.users SET user_status = ? WHERE user_id = ? LIMIT 1`, [note, user_id]);

    return res.json({ message: 'Note removed', result: add_note_query[0] });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:user_id/remove', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    const remove_query = await query(`UPDATE zichat.users SET user_status = null WHERE user_id = ? LIMIT 1`, [user_id]);

    return res.json({ message: 'Note removed', result: remove_query[0] });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
