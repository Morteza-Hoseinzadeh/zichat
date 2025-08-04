const connection = require('../../../models/dbConnection');

const defaultCryptoInfo = {
  BTCIRT: {
    english_name: 'Bitcoin',
    persian_name: 'بیت‌کوین',
    image_file: 'bitcoin-btc-logo',
    selected_coin: true,
  },
  SOLUSDT: {
    english_name: 'Solana',
    persian_name: 'سولانا',
    image_file: 'solana-sol-logo',
    selected_coin: true,
  },
  USDTIRT: {
    english_name: 'Tether USD',
    persian_name: 'تتر',
    image_file: 'tether-usdt-logo',
    issuer: 'Tether Limited',
    selected_coin: true,
  },
  TONUSDT: {
    english_name: 'Toncoin',
    persian_name: 'تون‌کوین',
    image_file: 'toncoin-ton-logo',
    original_developer: 'Telegram (now community-developed)',
    selected_coin: true,
  },
  BNBUSDT: {
    english_name: 'BNB (Build and Build)',
    persian_name: 'بایننس کوین',
    image_file: 'bnb-bnb-logo',
    selected_coin: false,
  },
  ADAUSDT: {
    english_name: 'Cardano',
    persian_name: 'کاردانو',
    image_file: 'cardano-ada-logo',
    selected_coin: false,
  },
  DOGEUSDT: {
    english_name: 'Dogecoin',
    persian_name: 'دوج‌کوین',
    image_file: 'dogecoin-doge-logo',
    selected_coin: false,
  },
  ETHIRT: {
    english_name: 'Ethereum',
    persian_name: 'اتریوم',
    image_file: 'ethereum-eth-logo',
    selected_coin: false,
  },
  TRXIRT: {
    english_name: 'TRON',
    persian_name: 'ترون',
    image_file: 'tron-trx-logo',
    selected_coin: false,
  },
  USDCUSDT: {
    english_name: 'USD Coin',
    persian_name: 'یواس‌دی کوین',
    image_file: 'usd-coin-usdc-logo',
    issuer: 'Circle (co-launched with Coinbase)',
    selected_coin: false,
  },
  XRPUSDT: {
    english_name: 'XRP',
    persian_name: 'ریپل',
    image_file: 'xrp-xrp-logo',
    selected_coin: false,
  },
};

Object.entries(defaultCryptoInfo).forEach(([symbol, data]) => {
  connection.query(
    `INSERT INTO cryptoes (symbol, english_name, persian_name, image_file, selected_coin)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       english_name = VALUES(english_name),
       persian_name = VALUES(persian_name),
       image_file = VALUES(image_file),
       selected_coin = VALUES(selected_coin)`,
    [symbol, data.english_name, data.persian_name, data.image_file, data.selected_coin],
    (err, result) => {
      if (err) console.error(`❌ Failed to insert ${symbol}`, err);
      else console.log(`✅ Inserted/Updated ${symbol}`);
    }
  );
});
