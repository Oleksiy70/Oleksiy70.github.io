import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const { login }         = useAuth();
  const nav               = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login({ email, password: pass });
      nav('/');
    } catch (err) {
      // axios помилка зберігає відповідь у err.response
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
}

  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Вхід</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={pass}
        onChange={e => setPass(e.target.value)}
        required
      />
      <button type="submit">Увійти</button>
      <p className="switch-auth">
        Ще не зареєстровані? <Link to="/register">Створити акаунт</Link>
      </p>
    </form>
  );
}
