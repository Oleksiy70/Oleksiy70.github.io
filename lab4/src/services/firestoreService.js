// src/services/firestoreService.js
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebase";

/**
 * Створює документ користувача (або оновлює, якщо вже існує)
 * @param {string} uid – ID користувача у Firebase Auth
 * @param {Object} data – довільні поля, які хочемо зберегти
 */
export const createUserProfile = async (uid, data) => {
  if (!uid) throw new Error("UID is required");
  // Використовуємо колекцію "users", а як ідентифікатор документа – uid
  const userRef = doc(firestore, "users", uid);
  await setDoc(userRef, data, { merge: true }); // merge: true дозапише, а не перепише весь документ
};

/**
 * Отримує профіль користувача за UID
 * @param {string} uid
 * @returns {Object|null}
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(firestore, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};

/**
 * Приклад: отримати всіх користувачів
 */
export const getAllUsers = async () => {
  const usersCol = collection(firestore, "users");
  const snapshot = await getDocs(usersCol);
  const users = [];
  snapshot.forEach((docSnap) => {
    users.push({ id: docSnap.id, ...docSnap.data() });
  });
  return users;
};
