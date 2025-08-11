const express = require('express');
const router = express.Router();

// User side routes
const crypto_file = require('./routes/cryptoes/route');
const chats_file = require('./routes/chats/route');
const contacts_file = require('./routes/contacts/route');
const sign_in_file = require('./routes/auth/signIn/route');

// TODO: develop sign up route
// const sign_up_file = require('./routes/auth/signIn/route');

const check_phone = require('./routes/auth/check-phone/route');

// Client side routes
router.use('/crypto', crypto_file);
router.use('/direct', chats_file);
router.use('/contacts', contacts_file);
router.use('/auth', sign_in_file);
router.use('/check', check_phone);

module.exports = { router };
