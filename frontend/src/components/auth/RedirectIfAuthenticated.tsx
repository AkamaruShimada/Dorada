// frontend/src/components/auth/RedirectIfAuthenticated.tsx

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const { isAuthenticated, utilisateur } = useAuth();

  if (isAuthenticated) {
    const destination = utilisateur?.typeCompte === 'CLIENT' ? '/' : '/admin';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}