const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const response = await axios.get('https://apiv2.nobitex.ir/v3/orderbook/all');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'خطا در هنگام ارسال اطلاعات' });
  }
});

module.exports = router;
