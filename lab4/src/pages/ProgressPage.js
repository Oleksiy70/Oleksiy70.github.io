import ProgressChart from '../components/ProgressChart';

export default function ProgressPage() {
  const [log, setLog] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('workoutLog') || '[]');
    setLog(stored.filter(w => w.completed));
  }, []);

  const removeEntry = idx => {
    const stored = JSON.parse(localStorage.getItem('workoutLog') || '[]');
    const updated = stored.filter((_, i) => i !== idx);
    localStorage.setItem('workoutLog', JSON.stringify(updated));
    setLog(updated.filter(w => w.completed));
  };

  return (
    <section className="container">
      <h2>Прогрес</h2>
      <ProgressChart />
      <ul className="grid-container">
        {log.map((w, i) => (
          <li key={i} className="workout-card">
            <img src={w.image} alt={w.title} />
            <h3>{w.title}</h3>
            <p>{w.duration} хв</p>
            <button
              className="delete-btn"
              onClick={() => removeEntry(i)}
              aria-label="Видалити запис"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
