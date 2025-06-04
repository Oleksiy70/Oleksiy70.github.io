// src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Помилка при виході:", err);
    }
  };

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Fitness Platform
      </Link>
      <nav>
        {currentUser ? (
          <>
            <span className="mr-4">Привіт, {currentUser.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Вхід
            </Link>
            <Link to="/register" className="hover:underline">
              Реєстрація
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
