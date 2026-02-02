import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Шапка */}
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:text-blue-400 transition">
            <span>🐰</span> Cunninghares
          </Link>
          
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/" className="hover:text-blue-400 transition">Главная</Link>
                <Link to="/chat" className="hover:text-blue-400 transition">Чат</Link>
                <Link to="/profile" className="hover:text-blue-400 transition">Профиль</Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition">
                    Админка
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-400 transition">Войти</Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>

      {/* Подвал */}
      <footer className="border-t border-gray-800 p-4 text-center text-gray-500 text-sm">
        © 2026 Cunninghares. Zenless Zone Zero fan project.
      </footer>
    </div>
  );
};

export default Layout;