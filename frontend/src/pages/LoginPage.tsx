import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from "../contexts/AuthForm";
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Если пользователь уже авторизован, перенаправляем
  useEffect(() => {
    if (user && !isLoading) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate]);

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Проверка авторизации...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Фон с элементами ZZZ */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Контент */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Шапка */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors"
          >
            <span className="text-3xl">🐰</span>
            <span>Cunninghares</span>
          </button>
          <p className="text-gray-400">Мессенджер в стиле Zenless Zone Zero</p>
        </div>

        {/* Основная форма */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Левая часть: описание */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Общайтесь с фанатами
                <span className="block text-blue-400">Zenless Zone Zero</span>
              </h1>
              
              <p className="text-gray-300 text-lg">
                Присоединяйтесь к сообществу фанатов ZZZ. Обсуждайте новости, делитесь артами, 
                находите единомышленников и создавайте свои посты.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400">💬</span>
                  </div>
                  <span>Живой чат с фанатами</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400">📝</span>
                  </div>
                  <span>Создание постов и медиа</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400">👥</span>
                  </div>
                  <span>Сообщества по интересам</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  Уже присоединились <span className="text-blue-400 font-medium">1,234</span> фанатов
                </p>
              </div>
            </div>
            
            {/* Правая часть: форма */}
            <div>
              <AuthForm />
              
              {/* Демо-доступ */}
              <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm text-center">
                  Для теста можно использовать:
                  <br />
                  <span className="text-blue-300">test@cunninghares.local</span> / <span className="text-green-300">password123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Футер */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2026 Cunninghares. Неофициальный фанатский проект Zenless Zone Zero.</p>
          <p className="mt-1">Все права на бренд принадлежат HoYoverse.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;