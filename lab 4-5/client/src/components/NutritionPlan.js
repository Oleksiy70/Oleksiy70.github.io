import React, { useEffect, useState } from 'react';

export default function NutritionPlan() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [proteinMeal, setProteinMeal] = useState('');
  const [carbsMeal, setCarbsMeal] = useState('');
  const [fatMeal, setFatMeal] = useState('');

  // Persisted macro calculator state
  const [goal, setGoal] = useState(() => localStorage.getItem('goal') || 'Схуднення');
  const [weight, setWeight] = useState(() => localStorage.getItem('weight') || '');
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0, calories: 0 });

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem('nutritionList') || '[]');
    setMeals(storedMeals);
  }, []);

  // Persist goal and weight
  useEffect(() => {
    localStorage.setItem('goal', goal);
  }, [goal]);
  useEffect(() => {
    localStorage.setItem('weight', weight);
  }, [weight]);

  // Recalculate macros when goal or weight changes
  useEffect(() => {
    const w = Number(weight);
    if (!w) return;
    let prot = 0, carb = 0, fat = 0;
    switch (goal) {
      case 'Схуднення':
        prot = 2 * w;
        carb = 3.2 * w;
        fat = 0.5 * w;
        break;
      case 'Рекомпозиція':
        prot = 2 * w;
        carb = 4 * w;
        fat = 0.5 * w;
        break;
      case `Набір м'язів`:
        prot = 2 * w;
        carb = 5 * w;
        fat = 0.8 * w;
        break;
      default:
          break;
    }
    const cal = prot * 4 + carb * 4 + fat * 9;
    setMacros({
      protein: Math.round(prot),
      carbs: Math.round(carb),
      fat: Math.round(fat),
      calories: Math.round(cal)
    });
  }, [goal, weight]);

  const addMeal = e => {
    e.preventDefault();
    const newMeal = { date, name, kcal: Number(kcal), protein: Number(proteinMeal), carbs: Number(carbsMeal), fat: Number(fatMeal) };
    const updated = [...meals, newMeal];
    localStorage.setItem('nutritionList', JSON.stringify(updated));
    setMeals(updated);
    setName(''); setKcal(''); setProteinMeal(''); setCarbsMeal(''); setFatMeal('');
  };

  const removeMeal = idx => {
    const updated = meals.filter((_, i) => i !== idx);
    localStorage.setItem('nutritionList', JSON.stringify(updated));
    setMeals(updated);
  };

  const todaysMeals = meals.filter(m => m.date === date);
  const totalCalories = todaysMeals.reduce((sum, m) => sum + m.kcal, 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = todaysMeals.reduce((sum, m) => sum + m.fat, 0);

  return (
    <section className="container">
      <h2>Раціон</h2>

      {/* Macro Calculator */}
      <div className="macro-calculator">
        <h3>Ваша мета та вага</h3>
        <div className="macro-options">
          {['Схуднення', 'Рекомпозиція', `Набір м'язів`].map(opt => (
            <label key={opt} className="macro-option">
              <input type="radio" name="goal" value={opt} checked={goal === opt} onChange={e => setGoal(e.target.value)} />
              {opt}
            </label>
          ))}
        </div>
        <div className="macro-inputs">
          <label>
            Вага (кг):
            <input type="number" min="1" value={weight} onChange={e => setWeight(e.target.value)} />
          </label>
        </div>
        <div className="macro-results">
          <div><span className="label">Білки (г)</span><span className="value">{macros.protein}</span></div>
          <div><span className="label">Вуглеводи (г)</span><span className="value">{macros.carbs}</span></div>
          <div><span className="label">Жири (г)</span><span className="value">{macros.fat}</span></div>
          <div><span className="label">Калорії (ккал)</span><span className="value">{macros.calories}</span></div>
        </div>
      </div>

      {/* Meal Entry */}
      <label>Дата: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <form onSubmit={addMeal} id="nutrition-form">
        <input type="text" placeholder="Назва страви" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Калорійність, ккал" value={kcal} onChange={e => setKcal(e.target.value)} required />
        <input type="number" placeholder="Білки (г)" value={proteinMeal} onChange={e => setProteinMeal(e.target.value)} required />
        <input type="number" placeholder="Вуглеводи (г)" value={carbsMeal} onChange={e => setCarbsMeal(e.target.value)} required />
        <input type="number" placeholder="Жири (г)" value={fatMeal} onChange={e => setFatMeal(e.target.value)} required />
        <button type="submit">Додати</button>
      </form>

      {/* Daily Summary */}
      <div className="daily-summary">
        <p>Дата: {date}</p>
        <p>Калорії: {totalCalories} ккал</p>
        <p>Білки: {totalProtein} г</p>
        <p>Вуглеводи: {totalCarbs} г</p>
        <p>Жири: {totalFat} г</p>
      </div>

      {/* Meal List */}
      <div className="nutrition-container">
        <ul className="nutrition-list">
          {todaysMeals.map((m, i) => (
            <li key={i}>
              <div className="meal-info">
                <span className="name">{m.name}</span>
                <span className="kcal">{m.kcal} ккал</span>
                <span className="macros">Б:{m.protein} / В:{m.carbs} / Ж:{m.fat}</span>
              </div>
              <button className="delete-btn" onClick={() => removeMeal(i)} aria-label={`Видалити ${m.name}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
