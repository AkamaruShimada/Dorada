// frontend/src/contexts/AuthContext.tsx

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Utilisateur } from '../types/auth.types';

interface AuthContextType {
  utilisateur: Utilisateur | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (utilisateur: Utilisateur) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement de l'app, on récupère les infos stockées si elles existent
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include', // Important pour envoyer les cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUtilisateur(data.utilisateur);
        } else {
          setUtilisateur(null);
        }
      } catch (error) {
        setUtilisateur(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  // login ne reçoit plus de token : il est déjà posé en cookie par le backend
  // on met juste à jour l'état local avec les infos utilisateur reçues
  function login(newUtilisateur: Utilisateur) {
    setUtilisateur(newUtilisateur);
  }

  async function logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // pour que le backend puisse clear le cookie
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      setUtilisateur(null);
    }
  }

  const value: AuthContextType = {
    utilisateur,
    isAuthenticated: !!utilisateur,
    isLoading,
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