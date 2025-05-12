require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// ініціалізуємо Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});
const db = admin.firestore();



const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // або ваш фронтенд-домен
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello, this is the root route of the server!');
});


app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require('./routes/auth');
const workoutsRoutes = require('./routes/workouts');

app.use('/auth', authRoutes);
app.use('/workouts', workoutsRoutes);