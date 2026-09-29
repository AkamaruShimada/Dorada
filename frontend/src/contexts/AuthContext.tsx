// frontend/src/contexts/AuthContext.tsx

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Utilisateur } from '../types/auth.types';

interface AuthContextType {
  utilisateur: Utilisateur | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, utilisateur: Utilisateur) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  // Au chargement de l'app, on récupère les infos stockées si elles existent
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUtilisateur(JSON.parse(storedUser));
    }
  }, []);

  function login(newToken: string, newUtilisateur: Utilisateur) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUtilisateur));
    setToken(newToken);
    setUtilisateur(newUtilisateur);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUtilisateur(null);
  }

  const value: AuthContextType = {
    utilisateur,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour consommer le contexte facilement
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  return context;
}