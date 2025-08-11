const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'Admin',
  password: process.env.DB_PASSWORD || '09906451808@Morteza',
  database: process.env.DB_NAME || 'zichat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL2:', err);
    return;
  }
  console.log('✅ Connected to MySQL2 as ID', connection.threadId);
});

module.exports = connection;
