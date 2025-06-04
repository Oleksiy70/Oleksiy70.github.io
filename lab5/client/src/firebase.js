// src/firebase.js
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:             process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:         process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:          process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:              process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:      process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Auth API
export const auth = getAuth(app);
export const firebaseAuthAPI = {
  register: (email, pass) =>
    createUserWithEmailAndPassword(auth, email, pass),
  login:    (email, pass) =>
    signInWithEmailAndPassword(auth, email, pass),
  logout:   () => signOut(auth),
  onAuthChange: cb => onAuthStateChanged(auth, cb),
};

// Firestore API
export const db = getFirestore(app);
export const firestoreAPI = {
  addDocTo: (col, data) =>
    addDoc(collection(db, col), data),
  getDocsFrom: (col, field, op, value) =>
    getDocs(query(collection(db, col), where(field, op, value))),
};
