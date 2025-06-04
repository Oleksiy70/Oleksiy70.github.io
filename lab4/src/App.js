// src/App.js
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import WorkoutsPage from "./pages/WorkoutsPage";
import ProgressPage from "./pages/ProgressPage";
import NutritionPage from "./pages/NutritionPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./pages/Profile";
import ProtectedPage from "./pages/ProtectedPage";

import "./App.css";

export default function App() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Помилка при виході:", err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>
          <NavLink to="/">Фітнес Платформа</NavLink>
        </h1>
        <nav>
          {/* Посилання на звичайні сторінки */}
          <NavLink to="/workouts" end>
            Тренування
          </NavLink>
          <NavLink to="/progress">Прогрес</NavLink>
          <NavLink to="/nutrition">Раціон</NavLink>

          {/* Якщо користувач залогінений, показуємо посилання "Профіль" і кнопку "Вийти" */}
          {currentUser ? (
            <>
              <NavLink to="/profile">Профіль</NavLink>
              <button className="logout-button" onClick={handleLogout}>
                Вийти
              </button>
            </>
          ) : (
            /* Якщо не залогінений — показуємо "Вхід" і "Реєстрацію" */
            <>
              <NavLink to="/login">Вхід</NavLink>
              <NavLink to="/register">Реєстрація</NavLink>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          {/* Головні маршрути вашого додатку */}
          <Route path="/" element={<WorkoutsPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />

          {/* Маршрут для входу/реєстрації */}
          <Route
            path="/login"
            element={currentUser ? <WorkoutsPage /> : <Login />}
          />
          <Route
            path="/register"
            element={currentUser ? <WorkoutsPage /> : <Register />}
          />

          {/* Профіль (доступ лише залогіненим) */}
         <Route
           path="/profile"
           element={currentUser ? <Profile /> : <p className="text-red-500">Щоб подивитися профіль, увійдіть.</p>}
         />

          {/* Приклад захищеної сторінки */}
          <Route
            path="/protected"
            element={
              currentUser ? (
                <ProtectedPage />
              ) : (
                <p className="must-login">Доступ лише для залогінених.</p>
              )
            }
          />

          {/* За бажанням: “застосунок 404” */}
          <Route path="*" element={<p>Сторінку не знайдено</p>} />
        </Routes>
      </main>

      <footer>Контакти: fitness@example.com</footer>
    </div>
  );
}
