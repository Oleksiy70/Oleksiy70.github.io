import React, { useState, useEffect } from 'react';
import WorkoutCard from './WorkoutCard';

const allWorkouts = [
  { id: 1, title: 'Кардіо для початківців', type: 'cardio', duration: 30, image: '/images/cardio.jpg' },
  { id: 2, title: 'Силове тренування', type: 'strength', duration: 45, image: '/images/silove.jpg' },
  { id: 3, title: 'Розтяжка', type: 'stretching', duration: 20, image: '/images/roztyah.jpg' },
  { id: 4, title: 'Йога для всіх', type: 'yoga', duration: 40, image: '/images/yoga.jpg' }
];

export default function WorkoutList() {
  const [filter, setFilter] = useState('all');
  const [log, setLog] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('workoutLog') || '[]');
    setLog(stored);
  }, []);

  const handleToggle = workout => {
    let updated;
    const exists = log.find(w => w.id === workout.id);
    if (exists) {
      updated = log.map(w =>
        w.id === workout.id
          ? { ...w, completed: !w.completed }
          : w
      );
    } else {
      updated = [...log, { ...workout, completed: true }];
    }
    setLog(updated);
    localStorage.setItem('workoutLog', JSON.stringify(updated));
  };

  const types = ['all', ...new Set(allWorkouts.map(w => w.type))];
  const filtered = filter === 'all'
    ? allWorkouts
    : allWorkouts.filter(w => w.type === filter);

  return (
    <section className="container">
      <h2>Тренування</h2>
      <label>
        Фільтр:{' '}
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'Усі' : t}</option>)}
        </select>
      </label>
      <div className="grid-container">
        {filtered.map(w => (
          <WorkoutCard
            key={w.id}
            workout={w}
            onToggle={() => handleToggle(w)}
            completed={!!log.find(item => item.id === w.id && item.completed)}
          />
        ))}
      </div>
    </section>
  );
}
