import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Перевірка токена при старті
useEffect(() => {
  const token = localStorage.getItem('token');
  async function fetchUser() {
    try {
      const profile = await api.get('/auth/me');
      setUser({ token, displayName: profile.data.nick });
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  if (token) {
    fetchUser();
  } else {
    setLoading(false);
  }
}, []);


  // Функція входу
async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);

  // Отримуємо nick
  const profile = await api.get('/auth/me');
  setUser({ token: res.data.token, displayName: profile.data.nick });
}

async function updateProfile(profileData) {
  await api.put('/auth/me', profileData);
  setUser(prev => ({ ...prev, ...profileData }));

  // Якщо є вага — додаємо запис у ваговий лог
  if (profileData.weight) {
    const today = new Date().toLocaleDateString();
    const entry = { date: today, weight: Number(profileData.weight) };
    const log = JSON.parse(localStorage.getItem('weightLog') || '[]');
    log.push(entry);
    localStorage.setItem('weightLog', JSON.stringify(log));
  }
}





  // Функція реєстрації
  async function register({ email, password, nick, weight, height, gender }) {
    await api.post('/auth/register', { email, password, nick, weight, height, gender });
    await login({ email, password });
  }

  // Функція виходу
  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

