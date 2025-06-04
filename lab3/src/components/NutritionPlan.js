import React, { useEffect, useState } from 'react';

export default function NutritionPlan() {
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('nutritionList') || '[]');
    setMeals(stored);
  }, []);

  const addMeal = e => {
    e.preventDefault();
    const updated = [...meals, { name, kcal }];
    localStorage.setItem('nutritionList', JSON.stringify(updated));
    setMeals(updated);
    setName('');
    setKcal('');
  };

  const removeMeal = idx => {
    const updated = meals.filter((_, i) => i !== idx);
    localStorage.setItem('nutritionList', JSON.stringify(updated));
    setMeals(updated);
  };

  return (
    <section className="container">
      <h2>Раціон</h2>
      <form onSubmit={addMeal} id="nutrition-form">
        <input
          type="text"
          placeholder="Назва страви"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Калорійність, ккал"
          value={kcal}
          onChange={e => setKcal(e.target.value)}
          required
        />
        <button type="submit">Додати</button>
      </form>
      <div className="nutrition-container">
        <ul className="nutrition-list">
          {meals.map((m, i) => (
            <li key={i}>
              🍽️ {m.name} — {m.kcal} ккал
              <button
                className="delete-btn"
                onClick={() => removeMeal(i)}
                aria-label={`Видалити ${m.name}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
