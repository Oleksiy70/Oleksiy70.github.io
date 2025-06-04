import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import WorkoutsPage from './pages/WorkoutsPage';
import ProgressPage from './pages/ProgressPage';
import NutritionPage from './pages/NutritionPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1><NavLink to="/">Фітнес Платформа</NavLink></h1>
        <nav>
          <NavLink to="/workouts" end>Тренування</NavLink>
          <NavLink to="/progress">Прогрес</NavLink>
          <NavLink to="/nutrition">Раціон</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<WorkoutsPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
        </Routes>
      </main>
      <footer>
        Контакти: fitness@example.com
      </footer>
    </div>
  );
}