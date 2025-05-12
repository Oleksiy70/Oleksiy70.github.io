// src/AppRoutes.js
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import WorkoutsPage from './pages/WorkoutsPage';
import ProgressPage from './pages/ProgressPage';
import NutritionPage from './pages/NutritionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './contexts/AuthContext';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header>
      <h1><NavLink to="/">Фітнес Платформа</NavLink></h1>
      <nav>
        <NavLink to="/workouts">Тренування</NavLink>
        <NavLink to="/progress">Прогрес</NavLink>
        <NavLink to="/nutrition">Раціон</NavLink>
      </nav>
      {user && (
        <div className="user-info">
          {user.displayName && location.pathname !== '/progress' && (<span className="user-nickname">{user.displayName}</span>)}

          <button className="auth-logout-btn" onClick={logout}>Вийти</button>
        </div>
      )}
    </header>
  );
}

export default function AppRoutes() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<WorkoutsPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer>Контакти: fitness@example.com</footer>
    </div>
  );
}

