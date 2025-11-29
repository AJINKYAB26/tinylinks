const crypto = require('crypto');

function generateCode(length = 6) {
  // length 6..8 supported
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const rnd = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    out += chars[rnd[i] % chars.length];
  }
  return out;
}

module.exports = { generateCode };
