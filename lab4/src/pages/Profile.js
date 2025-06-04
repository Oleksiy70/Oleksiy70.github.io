// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/firestoreService";

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const data = await getUserProfile(currentUser.uid);
        setProfileData(data);
      } catch (err) {
        console.error("Помилка при отриманні профілю:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  if (!currentUser) {
    return <p className="text-center mt-10 text-red-500">Ви неавторизовані.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Завантаження...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Ваш профіль</h2>
      {profileData ? (
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Дата реєстрації:</strong>{" "}
            {new Date(profileData.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Профіль не знайдено.</p>
      )}
    </div>
  );
};

export default Profile;
