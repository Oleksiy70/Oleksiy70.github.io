import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        nick,
        height: Number(height),
        weight: 0,
        gender
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Реєстрація</h2>
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
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Нік"
        value={nick}
        onChange={e => setNick(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Ріст (см)"
        value={height}
        onChange={e => setHeight(e.target.value)}
        required
      />
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option value="male">Чоловік</option>
        <option value="female">Жінка</option>
      </select>
      <button type="submit">Зареєструватися</button>
      <p className="switch-auth">
        Вже маєте акаунт? <Link to="/login">Увійти</Link>
      </p>
    </form>
  );
}