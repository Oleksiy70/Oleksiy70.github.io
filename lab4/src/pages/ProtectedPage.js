// src/pages/ProtectedPage.js
const ProtectedPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Захищена сторінка</h2>
      <p>Цей контент доступний тільки залогіненим користувачам.</p>
    </div>
  );
};

export default ProtectedPage;
