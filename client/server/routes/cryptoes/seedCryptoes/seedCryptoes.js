const connection = require('../../../models/dbConnection');
const persianNameMap = require('../data');

Object.entries(persianNameMap).forEach(([symbol, persian_name]) => {
  connection.query(`UPDATE cryptoes SET persian_name = ? WHERE symbol = ?`, [persian_name, symbol], (err, result) => {
    if (err) {
      console.error(`❌ Failed to update ${symbol}:`, err);
    } else if (result.affectedRows === 0) {
      console.warn(`⚠️ No matching entry found for symbol: ${symbol}`);
    } else {
      console.log(`✅ Updated ${symbol} with Persian name: ${persian_name}`);
    }
  });
});
