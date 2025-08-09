const connection = require('../dbConnection');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '942691ec528167ae3fedbb03d573370d473ad532f9465976d1ccf320f4a3fa6x';

const id = uuidv4();
const user_id = uuidv4();
const token = jwt.sign({ user_id }, SECRET_KEY, { expiresIn: '365d' });

connection.query('INSERT INTO zichat.users (id, user_id, username, phone, profile_picture, status, token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, user_id, 'مرتضی حسین زاده', '09906451808', null, 'active', token, new Date(), new Date()], (err, results) => {
  if (err) throw err;
  console.log('User inserted successfully');
});
