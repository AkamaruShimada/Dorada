// frontend/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import { RedirectIfAuthenticated } from './components/auth/RedirectIfAuthenticated.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
          } 
        />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;