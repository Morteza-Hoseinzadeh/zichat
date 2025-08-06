const express = require('express');
const axios = require('axios');
const router = express.Router();
const connection = require('../../models/dbConnection');

router.get('/prices/all', async (req, res) => {
  try {
    const [nobitexData, dbData] = await Promise.all([
      axios.get('https://apiv2.nobitex.ir/v3/orderbook/all'),
      new Promise((resolve, reject) => {
        connection.query('SELECT * FROM cryptoes', (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      }),
    ]);

    const market = nobitexData.data;
    const dbMap = Object.fromEntries(dbData.map((row) => [row.symbol, row]));

    const result = Object.entries(market)
      .slice(1)
      .map(([symbol, info]) => {
        const dbRow = dbMap[symbol];

        return {
          symbol,
          english_name: dbRow?.english_name || '',
          persian_name: dbRow?.persian_name || '',
          image_file: dbRow?.image_file || '',
          selected_coin: dbRow?.selected_coin || false,
          price: info.lastTradePrice || '',
          signals: {
            bids: info.bids || [],
            asks: info.asks || [],
          },
        };
      });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در دریافت یا پردازش اطلاعات' });
  }
});

router.put('/:symbol/update', async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    const query = `
      UPDATE zichat.cryptoes
      SET selected_coin = NOT selected_coin
      WHERE symbol = ?
    `;

    connection.query(query, [upperSymbol], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ type: 'error', data: 'خطا در اجرای کوئری' });
      }

      return res.json({ type: 'success', data: result });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: 'error', data: 'خطا در ارتباط با سرور' });
  }
});

module.exports = router;
