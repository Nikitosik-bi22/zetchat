import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  requireAuth = true 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  // Если роут требует авторизации, а пользователь не авторизован
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Если роут только для админов, а пользователь не админ
  if (adminOnly && (!user || !user.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  // Если роут для гостей (например, логин), а пользователь авторизован
  if (!requireAuth && user) {
    return <Navigate to={user.isAdmin ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;