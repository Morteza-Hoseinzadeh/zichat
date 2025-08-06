const express = require('express');
const router = express.Router();

// User side routes
const crypto_file = require('./routes/cryptoes/route');

// Client side routes
router.use('/crypto', crypto_file);

module.exports = { router };
