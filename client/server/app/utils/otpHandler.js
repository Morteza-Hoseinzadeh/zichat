const path = require('path');
const { loadData, saveData } = require('./fileHandler');

const OTP_FILE = path.join(__dirname, '../db/otps.json');

function loadOtps() {
  const data = loadData(OTP_FILE);
  return Array.isArray(data) ? data : [];
}

function saveOtps(otps) {
  saveData(OTP_FILE, otps);
}

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function createOtpEntry({ phone, username, email, password }) {
  const otps = loadOtps();
  const existing = otps.find((otp) => otp.phone === phone);

  if (existing && Date.now() - existing.createdAt < 2 * 60 * 1000) {
    // 2 دقیقه فاصله
    throw new Error('لطفاً قبل از درخواست یک OTP جدید، منتظر بمانید.');
  }

  const otp_code = generateOtp();
  const expireAt = Date.now() + 5 * 60 * 1000; // 5 دقیقه

  const newOtp = { phone, username, email, password, code: otp_code, expireAt, createdAt: Date.now() };

  const updatedOtps = otps.filter((otp) => otp.phone !== phone);
  updatedOtps.push(newOtp);
  saveOtps(updatedOtps);

  return otp_code;
}

function verifyOtp(phone, code) {
  const otps = loadOtps();
  const otpEntry = otps.find((otp) => otp.phone === phone && otp.code === code);

  if (!otpEntry) {
    throw new Error('کد OTP نامعتبر است.');
  }
  if (Date.now() > otpEntry.expireAt) {
    removeOtp(phone);
    throw new Error('کد OTP منقضی شده است. لطفاً دوباره تلاش کنید.');
  }

  return otpEntry;
}

function removeOtp(phone) {
  const otps = loadOtps();
  const updatedOtps = otps.filter((otp) => otp.phone !== phone);
  saveOtps(updatedOtps);
}

module.exports = { createOtpEntry, verifyOtp, removeOtp };
