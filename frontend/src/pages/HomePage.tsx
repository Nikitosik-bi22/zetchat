import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Шапка */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐰</span>
          <h1 className="text-2xl font-bold">Cunninghares</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">@{user.username}</div>
                  <div className="text-xs text-gray-400">
                    {user.isAdmin ? 'Администратор' : 'Пользователь'}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Войти
            </Link>
          )}
        </div>
      </header>
      
      {/* Основной контент */}
      <main className="max-w-6xl mx-auto">
        {user ? (
          // Контент для авторизованных пользователей
          <div className="text-center py-12">
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Добро пожаловать, @{user.username}!</h2>
            <p className="text-gray-400 text-lg mb-8">
              Рады видеть вас в сообществе Cunninghares!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Link
                to="/chat"
                className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-blue-500 transition-colors"
              >
                <div className="text-3xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">Чат</h3>
                <p className="text-gray-400 text-sm">
                  Общайтесь с другими фанатами в реальном времени
                </p>
              </Link>
              
              <Link
                to="/posts"
                className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-purple-500 transition-colors"
              >
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Лента постов</h3>
                <p className="text-gray-400 text-sm">
                  Создавайте посты и смотрите публикации других
                </p>
              </Link>
              
              <Link
                to="/profile"
                className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-green-500 transition-colors"
              >
                <div className="text-3xl mb-4">👤</div>
                <h3 className="text-xl font-bold mb-2">Профиль</h3>
                <p className="text-gray-400 text-sm">
                  Настройте аватар и информацию о себе
                </p>
              </Link>
            </div>
          </div>
        ) : (
          // Контент для гостей
          <div className="text-center py-16">
            <h2 className="text-4xl font-bold mb-6">
              Мессенджер для фанатов
              <span className="block text-blue-400">Zenless Zone Zero</span>
            </h2>
            
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Присоединяйтесь к сообществу, обсуждайте новости, делитесь артами 
              и находите единомышленников в мире ZZZ.
            </p>
            
            <div className="space-y-6 max-w-xl mx-auto">
              <Link
                to="/login"
                className="block w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-xl font-medium transition-all duration-300"
              >
                Присоединиться к сообществу
              </Link>
              
              <p className="text-gray-500 text-sm">
                Уже <span className="text-blue-400">1,234</span> фанатов общаются здесь
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;