const jwt = require('jsonwebtoken');

// JWT_EXPIRE_TIME should look like "90d". A bare number ("90") is read by
// jsonwebtoken as MILLISECONDS, which makes every token expire instantly,
// so treat bare numbers as days and fall back to 90 days when it is missing.
const expiresIn = () => {
  const raw = (process.env.JWT_EXPIRE_TIME || '').trim();
  if (!raw) return '90d';
  if (/^\d+$/.test(raw)) return `${raw}d`;
  return raw;
};

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresIn(),
  });

module.exports = createToken;
