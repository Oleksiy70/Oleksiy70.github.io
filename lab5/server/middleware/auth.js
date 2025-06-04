// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Неавторизовано' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = payload.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Токен недійсний' });
  }
};