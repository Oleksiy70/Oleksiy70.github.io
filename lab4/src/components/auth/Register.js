// src/components/auth/Register.js
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../../services/firestoreService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Викликаємо реєстрацію у Firebase Auth
      const userCredential = await register(email, password);
      const user = userCredential.user;

      // Після успішної реєстрації записуємо додаткові дані у Firestore
      await createUserProfile(user.uid, {
        email: user.email,
        createdAt: new Date().toISOString(),
        // За потреби додайте інші поля, наприклад:
        // name: "",
        // avatarUrl: "",
      });

      // Переходимо на головну або будь-яку іншу сторінку
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Реєстрація</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Пароль:</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
};

export default Register;
