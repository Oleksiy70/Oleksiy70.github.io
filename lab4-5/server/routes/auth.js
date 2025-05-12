// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const db = admin.firestore();

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  console.log('Register request body:', req.body);
  const { email, password, nick, weight, height, gender } = req.body;
  // .. валідація
  const hashed = await bcrypt.hash(password, 10);
  const userRef = db.collection('users').doc();
  await userRef.set({ email, password: hashed, nick, weight, height, gender, createdAt: Date.now() });
  res.status(201).json({ id: userRef.id });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request body:', req.body);
  const snap = await db.collection('users').where('email', '==', email).get();
  if (snap.empty) return res.status(400).json({ error: 'Користувача не знайдено' });
  const user = snap.docs[0].data();
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Невірний пароль' });
  const token = jwt.sign({ uid: snap.docs[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

router.get(
  '/me',
  require('../middleware/auth'),
  async (req, res) => {
    const doc = await db.collection('users').doc(req.uid).get();
    const user = doc.data();
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
    res.json({
      email:   user.email,
      nick:    user.nick,
      weight:  user.weight,
      height:  user.height,
      gender:  user.gender,
    });
  }
);


// PUT /auth/me — оновлення профілю
router.put(
  '/me',
  require('../middleware/auth'), // перевіряє токен і містить req.uid
  async (req, res) => {
    try {
      const { nick, weight, height } = req.body;
      if (!nick || !weight || !height) {
        return res.status(400).json({ error: 'Усі поля обовʼязкові' });
      }
      const userRef = db.collection('users').doc(req.uid);
      await userRef.update({ nick, weight, height });
      res.json({ success: true });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: 'Не вдалося оновити профіль' });
    }
  }
);

module.exports = router;