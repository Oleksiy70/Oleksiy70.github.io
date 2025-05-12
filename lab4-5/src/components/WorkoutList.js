// WorkoutList.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import WorkoutCard from './WorkoutCard';
import AddWorkoutForm from './AddWorkoutForm';

export default function WorkoutList() {
  const { user } = useAuth();
  const workoutKey = user ? `workoutLog_${user.email}` : 'workoutLog_guest';

  const [filter, setFilter] = useState('all');
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [log, setLog] = useState([]);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await api.get('/workouts');
        const flatWorkouts = Array.isArray(res.data) ? res.data : Object.values(res.data).flat();
        setAllWorkouts(flatWorkouts);
      } catch (err) {
        console.error('Error fetching workouts:', err);
      }
    }

    const storedLog = JSON.parse(localStorage.getItem(workoutKey) || '[]');
    setLog(storedLog);
    fetchWorkouts();
  }, [workoutKey]);

  const handleCreated = newWorkout => {
    setAllWorkouts(ws => [newWorkout, ...ws]);
  };

  const handleToggle = workout => {
    const exists = log.find(w => w.id === workout.id);
    const now = new Date().toISOString().slice(0, 10);
    const entry = {
      id: workout.id,
      completed: exists ? !exists.completed : true,
      date: workout.date || now,
      duration: workout.type === 'Силове'
        ? (workout.exercises || []).reduce((sum, ex) => {
            const sets = Number(ex.sets) || 0;
            if (sets <= 0) return sum;
            return sum + sets * 1 + (sets - 1) * 2;
          }, 0)
        : workout.duration
    };
    const updated = exists
      ? log.map(w => w.id === workout.id ? entry : w)
      : [...log, entry];
    setLog(updated);
    localStorage.setItem(workoutKey, JSON.stringify(updated));
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/workouts/${id}`);
      setAllWorkouts(prev => prev.filter(w => w.id !== id));
      setLog(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Не вдалося видалити тренування:', err);
    }
  };

  const types = ['all', ...new Set(allWorkouts.map(w => w.type))];
  const filtered = filter === 'all'
    ? allWorkouts
    : allWorkouts.filter(w => w.type === filter);

  return (
    <section className="container">
      <AddWorkoutForm onCreated={handleCreated} />

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
            onDelete={() => handleDelete(w.id)}
            completed={!!log.find(item => item.id === w.id && item.completed)}
          />
        ))}
      </div>
    </section>
  );
}