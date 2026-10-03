// frontend/src/components/auth/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, utilisateur } = useAuth();

  // Tant qu'on ne sait pas encore si l'utilisateur est connecté,
  // on affiche un état de chargement plutôt que de décider trop vite
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (utilisateur?.typeCompte === 'CLIENT') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}