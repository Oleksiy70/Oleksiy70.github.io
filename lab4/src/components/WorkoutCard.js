import React from 'react';

export default function WorkoutCard({ workout, onToggle, completed }) {
  return (
    <div className="workout-card">
      <img src={workout.image} alt={workout.title} />
      <h3>{workout.title}</h3>
      <p>Тип: {workout.type}</p>
      <p>Тривалість: {workout.duration} хв</p>
      <button
        className="complete-btn"
        onClick={onToggle}
      >
        {completed ? 'Почати заново' : 'Завершити тренування'}
      </button>
    </div>
  );
}