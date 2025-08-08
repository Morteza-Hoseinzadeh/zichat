const express = require('express');
const router = express.Router();

// User side routes
const crypto_file = require('./routes/cryptoes/route');
const chats_file = require('./routes/chats/route');
const contacts_file = require('./routes/contacts/route');
const sign_in_file = require('./routes/sign-in/route');

// Client side routes
router.use('/crypto', crypto_file);
router.use('/direct', chats_file);
router.use('/contacts', contacts_file);
router.use('/sign-in', sign_in_file);

module.exports = { router };
