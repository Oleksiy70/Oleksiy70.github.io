import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function AddWorkoutForm({ onCreated }) {
  const { user } = useAuth();
  const workoutKey = user ? `workoutLog_${user.email}` : 'workoutLog_guest';

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Силове');
  const [exercises, setExercises] = useState([{ name: '', reps: '', sets: '' }]);
  const [duration, setDuration] = useState('');
  const [error, setError] = useState(null);
  const workoutTypes = ['Силове', 'Кардіо', 'Розтяжка', 'Йога'];

  const handleExerciseChange = (idx, field, value) => {
    setExercises(exs =>
      exs.map((ex, i) =>
        i === idx ? { ...ex, [field]: value } : ex
      )
    );
  };

  const addExercise = () =>
    setExercises(exs => [...exs, { name: '', reps: '', sets: '' }]);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      date,
      title,
      type,
      duration: type === 'Силове'
        ? exercises.reduce((tot, ex) => {
            const sets = Number(ex.sets);
            if (isNaN(sets) || sets <= 0) return tot;
            const timePerSet = 1, restBetweenSets = 2;
            return tot + sets * timePerSet + (sets - 1) * restBetweenSets;
          }, 0)
        : Number(duration),
      exercises: type === 'Силове'
        ? exercises.map(ex => ({ name: ex.name, reps: Number(ex.reps), sets: Number(ex.sets) }))
        : []
    };

    try {
      const res = await api.post('/workouts', payload);
      const newWorkout = { id: res.data.id, ...payload };
      onCreated(newWorkout);
      // Додаємо в локальний лог як завершене одразу
      const nowEntry = { id: newWorkout.id, completed: true, date };
      const rawLog = JSON.parse(localStorage.getItem(workoutKey) || '[]');
      localStorage.setItem(workoutKey, JSON.stringify([...rawLog, nowEntry]));

      // Скидаємо форму
      setDate(new Date().toISOString().slice(0, 10));
      setTitle('');
      setType('Силове');
      setExercises([{ name: '', reps: '', sets: '' }]);
      setDuration('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-workout-form">
      <h3>Додати тренування</h3>
      {error && <p className="error">{error}</p>}

      <label>
        Дата:
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Назва:
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Назва"
          required
        />
      </label>

      <label>
        Тип:
        <select value={type} onChange={e => setType(e.target.value)}>
          {workoutTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      {type === 'Силове' ? (
        <>
          <h4>Вправи</h4>
          {exercises.map((ex, i) => (
            <div key={i} className="exercise-row">
              <input
                type="text"
                value={ex.name}
                onChange={e => handleExerciseChange(i, 'name', e.target.value)}
                placeholder="Назва вправи"
                required
              />
              <input
                type="number"
                value={ex.reps}
                onChange={e => handleExerciseChange(i, 'reps', e.target.value)}
                placeholder="Повторень"
                required
              />
              <input
                type="number"
                value={ex.sets}
                onChange={e => handleExerciseChange(i, 'sets', e.target.value)}
                placeholder="Сетів"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addExercise}>+ Додати вправу</button>
        </>
      ) : (
        <label>
          Тривалість (хв):
          <input
            type="number"
            min="1"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder="Наприклад, 30"
            required
          />
        </label>
      )}

      <button type="submit">Створити</button>
    </form>
  );
}
