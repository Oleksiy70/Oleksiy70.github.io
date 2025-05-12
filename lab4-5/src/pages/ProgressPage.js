// ProgressPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import ProgressChart from '../components/ProgressChart';

export default function ProgressPage() {
  const { user } = useAuth();
  const workoutKey = user ? `workoutLog_${user.email}` : 'workoutLog_guest';
  const weightKey = user ? `weightLog_${user.email}` : 'weightLog_guest';

  const [profile, setProfile] = useState(null);
  const [weightLog, setWeightLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryWeight, setEntryWeight] = useState('');

  useEffect(() => {
    if (!user) return;

    api.get('/auth/me')
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));

    const weights = JSON.parse(localStorage.getItem(weightKey) || '[]');
    setWeightLog(weights);

    const rawLog = JSON.parse(localStorage.getItem(workoutKey) || '[]');

    api.get('/workouts')
      .then(res => {
        const defs = Array.isArray(res.data) ? res.data : Object.values(res.data).flat();
        const enriched = rawLog
          .filter(entry => entry.completed)
          .map(entry => {
            const def = defs.find(w => w.id === entry.id) || {};
            let duration = entry.duration || def.duration;
            if (!duration && def.exercises) {
              // для силових: кожен сет =1 хв, відпочинок між сетами =2 хв
              duration = def.exercises.reduce((sum, ex) => {
                const sets = Number(ex.sets) || 0;
                if (sets <= 0) return sum;
                return sum + sets * 1 + (sets - 1) * 2;
              }, 0);
            }
            return { ...def, ...entry, duration };
          });
        const sorted = enriched.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWorkoutLog(sorted);
      })
      .catch(() => {
        const filtered = rawLog.filter(e => e.completed);
        const sortedRaw = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWorkoutLog(sortedRaw);
      });
  }, [user, weightKey, workoutKey]);

  if (!user) return <p>Будь ласка, увійдіть, щоб переглянути прогрес.</p>;

  const addWeight = e => {
    e.preventDefault();
    const newEntry = { date: entryDate, weight: Number(entryWeight) };
    const updated = [...weightLog.filter(w => w.date !== entryDate), newEntry];
    setWeightLog(updated);
    localStorage.setItem(weightKey, JSON.stringify(updated));
    setEntryWeight('');
  };

  const clearWeights = () => {
    if (!window.confirm('Ви дійсно хочете очистити графік ваги?')) return;
    localStorage.removeItem(weightKey);
    setWeightLog([]);
  };

  const deleteWorkout = idx => {
    const rawLog = JSON.parse(localStorage.getItem(workoutKey) || '[]');
    rawLog.splice(idx, 1);
    localStorage.setItem(workoutKey, JSON.stringify(rawLog));
    setWorkoutLog(prev => prev.filter((_, i) => i !== idx));
  };

  const chartData = weightLog
    .map(e => ({ date: e.date, weight: e.weight }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section className="container">
      <div className="profile-card">
        <h3>Профіль користувача</h3>
        {profile ? (
          <ul>
            {profile.email && <li><strong>Email:</strong> {profile.email}</li>}
            {profile.nick && <li><strong>Нік:</strong> {profile.nick}</li>}
            {profile.height && <li><strong>Ріст:</strong> {profile.height} см</li>}
            {profile.gender && <li><strong>Стать:</strong> {profile.gender === 'male' ? 'Чоловік' : 'Жінка'}</li>}
          </ul>
        ) : <p>Завантаження профілю…</p>}
      </div>

      <h2>Динаміка ваги</h2>
      <form onSubmit={addWeight} className="weight-entry-form">
        <label>Дата:
          <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} required />
        </label>
        <label>Вага (кг):
          <input type="number" step="0.1" value={entryWeight} onChange={e => setEntryWeight(e.target.value)} required />
        </label>
        <button type="submit">Зберегти вагу</button>
      </form>
      <button type="button" className="clear-btn" onClick={clearWeights}>Очистити графік</button>
      <ProgressChart data={chartData} />

      <h2>Пройдені тренування</h2>
      {workoutLog.length === 0 ? <p>Немає завершених тренувань.</p> : (
        <ul className="grid-container">
          {workoutLog.map((w, i) => (
            <li key={i} className="workout-card">
              <h3>{w.title}</h3>
              <p><strong>Тип:</strong> {w.type}</p>
              <p><strong>Тривалість:</strong> {w.duration} хв</p>
              <p><strong>Дата:</strong> {w.date}</p>
              {w.exercises?.length > 0 && (
                <ul>{w.exercises.map((ex, idx) => <li key={idx}>{ex.name} — {ex.sets} x {ex.reps}</li>)}</ul>
              )}
              <button type="button" className="delete-btn" onClick={() => deleteWorkout(i)}>Видалити</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}