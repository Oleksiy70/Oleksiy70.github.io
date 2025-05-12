import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './AppRoutes';
import './index.css';

function App() {
  return (
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
  );
}

export default App;