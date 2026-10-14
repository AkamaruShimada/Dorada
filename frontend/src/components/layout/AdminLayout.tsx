// frontend/src/layouts/AdminLayout.tsx

import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

function AdminLayout() {
  const { utilisateur, logout } = useAuth();
  const [menuOuvert, setMenuOuvert] = useState<boolean>(false);

  return (
    <>
        <header className="bg-primary text-surface">
        <div className="flex items-center justify-between px-6 py-4">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <a href="/" className="font-bold text-xl">
                    <img src="/images/dorada_logo.png" alt="Logo" className="h-30 w-auto" />
                </a>

                <h1 className="text-xl font-bold">{utilisateur?.nom}</h1>
            </div>



            {/* Navigation desktop */}
            <nav className="hidden md:flex gap-6">
                <NavLink to="/admin" end>Tableau de bord
                </NavLink>
                <NavLink to="/admin/empanadas">Empanadas</NavLink>
                <NavLink to="/admin/extras">Extras</NavLink>
                <NavLink to="/admin/formules">Formules</NavLink>
                <NavLink to="/admin/commandes">Commandes</NavLink>
            </nav>

            {/* Bouton Commander (desktop) */}
            <button onClick={logout}
            className="hidden md:inline-block bg-secondary text-primary font-semibold px-5 py-2 rounded-md hover:opacity-90 transition"
            >
            Déconnexion
            </button>

            {/* Bouton burger (mobile uniquement) */}
            <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOuvert}
            >
            <span className="w-6 h-0.5 bg-surface"></span>
            <span className="w-6 h-0.5 bg-surface"></span>
            <span className="w-6 h-0.5 bg-surface"></span>
            </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOuvert && (
            <nav className="md:hidden flex flex-col gap-4 px-6 pb-4">
                <NavLink to="/admin" end>Tableau de bord
                </NavLink>
                <NavLink to="/admin/empanadas">Empanadas</NavLink>
                <NavLink to="/admin/formules">Formules</NavLink>
                <NavLink to="/admin/extras">Extras</NavLink>
                <NavLink to="/admin/commandes">Commandes</NavLink>
            <button
                onClick={logout}
                className="bg-secondary text-primary font-semibold px-5 py-2 rounded-md text-center"
            >
                Déconnexion
            </button>
            </nav>
        )}

        </header>
        
        <main className="admin-content">
            <Outlet />
        </main>
    </>
  );
}

export default AdminLayout;