import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'register' | 'verify';

const AuthForm: React.FC = () => {
  const { login, register, verifyEmail, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Для регистрации - запоминаем email
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccess('Вход выполнен успешно!');
      } else if (mode === 'register') {
        await register(username, email, password);
        setPendingEmail(email);
        setMode('verify');
        setSuccess('Регистрация успешна! Проверьте email для кода подтверждения.');
      } else if (mode === 'verify') {
        await verifyEmail(pendingEmail || email, verificationCode);
        setSuccess('Email подтверждён! Вы вошли в систему.');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900/70 border border-gray-700 rounded-2xl p-8 shadow-2xl">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🐰</div>
        <h2 className="text-2xl font-bold text-white">
          {mode === 'login' && 'Вход в Cunninghares'}
          {mode === 'register' && 'Регистрация'}
          {mode === 'verify' && 'Подтверждение email'}
        </h2>
        <p className="text-gray-400 mt-2">
          {mode === 'login' && 'Добро пожаловать в мессенджер Zenless Zone Zero!'}
          {mode === 'register' && 'Создайте аккаунт, чтобы присоединиться'}
          {mode === 'verify' && 'Введите код из письма'}
        </p>
      </div>

      {/* Сообщения об ошибках/успехе */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm">
          ✅ {success}
        </div>
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Поле username (только для регистрации) */}
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Имя пользователя
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="@zenlesszonezero"
              required
              minLength={3}
              maxLength={30}
            />
            <p className="text-xs text-gray-500 mt-1">
              Будет отображаться как @{username || 'username'}
            </p>
          </div>
        )}

        {/* Поле email (кроме verify) */}
        {(mode === 'login' || mode === 'register') && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
        )}

        {/* Поле email для verify (только отображение) */}
        {mode === 'verify' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email для подтверждения
            </label>
            <div className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
              {pendingEmail || email}
            </div>
          </div>
        )}

        {/* Поле verification code (только для verify) */}
        {mode === 'verify' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Код подтверждения (6 цифр)
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center text-2xl tracking-widest"
              placeholder="123456"
              required
              pattern="\d{6}"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Код отправлен на ваш email
            </p>
          </div>
        )}

        {/* Поле пароля (для login и register) */}
        {(mode === 'login' || mode === 'register') && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {mode === 'register' && (
              <p className="text-xs text-gray-500 mt-1">
                Минимум 6 символов
              </p>
            )}
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Загрузка...
            </span>
          ) : (
            <span>
              {mode === 'login' && 'Войти'}
              {mode === 'register' && 'Зарегистрироваться'}
              {mode === 'verify' && 'Подтвердить email'}
            </span>
          )}
        </button>
      </form>

      {/* Переключение между режимами */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        {mode === 'login' ? (
          <div className="text-center text-sm text-gray-400">
            Нет аккаунта?{' '}
            <button
              onClick={() => {
                setMode('register');
                setError('');
                setSuccess('');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Зарегистрироваться
            </button>
          </div>
        ) : mode === 'register' ? (
          <div className="text-center text-sm text-gray-400">
            Уже есть аккаунт?{' '}
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Войти
            </button>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-400">
            Не получили код?{' '}
            <button
              onClick={() => {
                setMode('register');
                setError('');
                setSuccess('');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Зарегистрироваться заново
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;