// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

// Створюємо контекст
const AuthContext = createContext();

// Провайдер обгортає увесь додаток
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Підписка на зміни стану авторизації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Функція реєстрації
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Функція логіну
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Функція виходу
  const logout = () => {
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Хук для спрощеного доступу до контексту
export const useAuth = () => {
  return useContext(AuthContext);
};
