const express = require('express');
const router = express.Router();

// User side routes
const crypto_file = require('./routes/cryptoes/route');
const chats_file = require('./routes/chats/route');

// Client side routes
router.use('/crypto', crypto_file);
router.use('/direct', chats_file);

module.exports = { router };
