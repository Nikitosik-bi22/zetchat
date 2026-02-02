import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } />
          
          {/* Маршруты с общим Layout */}
          <Route element={<Layout />}>
            {/* Главная страница - доступна всем */}
            <Route path="/" element={<HomePage />} />
            
            {/* Админ-панель - только для админов */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            } />
            
            {/* Защищённые маршруты для обычных пользователей (пока заглушки) */}
            <Route path="/chat" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 text-white p-8">
                  <h1 className="text-3xl font-bold">Чат (в разработке)</h1>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 text-white p-8">
                  <h1 className="text-3xl font-bold">Профиль (в разработке)</h1>
                </div>
              </ProtectedRoute>
            } />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="text-white text-2xl">404 - Страница не найдена</div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;