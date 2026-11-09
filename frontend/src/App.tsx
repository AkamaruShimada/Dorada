// frontend/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RedirectIfAuthenticated } from './components/auth/RedirectIfAuthenticated.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import MenuPage from './pages/MenuPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import PanierPage from './pages/PanierPage.tsx'

import MentionsLegalesPage from './pages/MentionsLegalesPage';
import ConfidentialitePage from './pages/ConfidentialitePage';
import CGUPage from './pages/CGUPage';
import CGVPage from './pages/CGVPage';

import CommandeSucces from './pages/CommandeSucces.tsx';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminEmpanadas from './pages/admin/AdminEmpanadas';
import AdminExtras from './pages/admin/AdminExtras';
import AdminBoissons from './pages/admin/AdminBoisson.tsx';
import AdminFormules from './pages/admin/AdminFormules';
import AdminCommandes from './pages/admin/AdminCommandes';
import AdminCodesPromo from './pages/admin/AdminCodePromo.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/menu' element={<MenuPage/>} />
        <Route path='/contact' element={<ContactPage/>} />
        <Route path="/panier" element={<PanierPage />} />
        <Route path="/commande/succes" element={<CommandeSucces />} />

        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/confidentialite" element={<ConfidentialitePage />} />
        <Route path="/cgu" element={<CGUPage />} />
        <Route path="/cgv" element={<CGVPage />} />
        
        <Route path="/login" element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="empanadas" element={<AdminEmpanadas />} />
          <Route path="extras" element={<AdminExtras />} />
          <Route path="boissons" element={<AdminBoissons />} />
          <Route path="formules" element={<AdminFormules />} />
          <Route path="commandes" element={<AdminCommandes />} />
          <Route path="codes-promo" element={<AdminCodesPromo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;