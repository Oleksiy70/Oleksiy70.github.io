import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestoreAPI } from '../firebase';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState({});

  useEffect(() => {
    if (!user) return;
    firestoreAPI.getUserWorkouts(user.uid)
      .then(snap => {
        const grouped = {};
        snap.forEach(doc => {
          const data = doc.data();
          grouped[data.type] = grouped[data.type] || [];
          grouped[data.type].push({ id: doc.id, ...data });
        });
        setWorkouts(grouped);
      });
  }, [user]);

  return (
    <div>
      <header>
        <h1>Привіт, {user.email}</h1>
        <button onClick={logout}>Вийти</button>
      </header>

      <section>
        <h2>Мій прогрес</h2>
        {Object.entries(workouts).map(([type, list]) => (
          <div key={type}>
            <h3>{type}</h3>
            <ul>
              {list.map(w =>
                <li key={w.id}>{w.title} — {w.duration} хв</li>
              )}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
