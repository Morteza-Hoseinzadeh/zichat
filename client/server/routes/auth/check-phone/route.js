const express = require('express');
const router = express.Router();
const connection = require('../../../models/dbConnection');

// Helper function for database queries
const query = async (sql, params) => {
  try {
    const [results] = await connection.promise().query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

router.get('/check-phone')

module.exports = router;
