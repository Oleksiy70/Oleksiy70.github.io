// server/routes/workouts.js
const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const router = express.Router();

// GET /workouts — повернути всі тренування
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('workouts').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не вдалося завантажити тренування' });
  }
});

// POST /workouts — створити нове тренування
router.post('/', async (req, res) => {
  try {
    const { title, type, exercises } = req.body;
    if (!title || !type || !Array.isArray(exercises)) {
      return res.status(400).json({ error: 'Неправильні дані для тренування' });
    }
    const docRef = await db.collection('workouts').add({
      title,
      type,
      exercises,      // наприклад: [{ name, reps, sets }, …]
      createdAt: Date.now(),
    });
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не вдалося створити тренування' });
  }
});

// DELETE /workouts/:id — видалення тренування
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('workouts').doc(id).delete();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting workout:', err);
    res.status(500).json({ error: 'Не вдалося видалити тренування' });
  }
});


module.exports = router;
