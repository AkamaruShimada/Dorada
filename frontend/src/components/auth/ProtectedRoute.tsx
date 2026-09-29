// frontend/src/components/auth/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, utilisateur } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (utilisateur?.typeCompte === 'CLIENT') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}