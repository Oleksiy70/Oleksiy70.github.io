export default function WorkoutCard({ workout, onToggle, onDelete, completed }) {
  return (
    <div className="workout-card">
      <h3>{workout.title}</h3>
      <p><strong>Тип:</strong> {workout.type}</p>

      <div className="button-group">
        <button className="complete-btn" onClick={onToggle}>
          {completed ? 'Почати заново' : 'Завершити'}
        </button>
        <button className="delete-btn" onClick={onDelete}>
          Видалити
        </button>
      </div>
    </div>
  );
}
