import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalPosts: 0,
    totalMessages: 0,
    pendingVerifications: 0,
    newUsersToday: 0
  });

  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'users'>('overview');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error';
    }
  };

  const loadData = async () => {
    try {
      const [statsData, pendingData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingVerifications()
      ]);

      setStats(statsData);
      setPendingUsers(pendingData);

      // updatedAt может быть undefined — подстрахуемся
      if ((statsData as any)?.updatedAt) {
        setLastUpdate(new Date((statsData as any).updatedAt));
      } else {
        setLastUpdate(new Date());
      }
    } catch (error: unknown) {
      console.error('Ошибка загрузки данных:', error);

      const msg = getErrorMessage(error);

      // Если ошибка авторизации, перенаправить на логин
      if (msg.includes('401') || msg.includes('Ошибка авторизации')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      await adminApi.verifyUser(userId);

      // безопаснее через функциональное обновление, чтобы не ловить "старый" state
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      setStats(prev => ({
        ...prev,
        pendingVerifications: Math.max(0, prev.pendingVerifications - 1)
      }));
    } catch (error: unknown) {
      console.error('Ошибка верификации:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка панели администратора...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-6">
      {/* Шапка */}
      <div className="mb-8">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="text-blue-400">⚙️</span> Панель администратора Cunninghares
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Последнее обновление: {lastUpdate.toLocaleTimeString()}
              <button
                onClick={loadData}
                className="ml-2 md:ml-4 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition-colors"
              >
                Обновить
              </button>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Навигационные табы */}
        <div className="flex border-b border-gray-800 mt-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-sm md:text-base transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            📊 Обзор
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-3 font-medium text-sm md:text-base transition-colors whitespace-nowrap ${
              activeTab === 'verification'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            ✅ Верификация
            {stats.pendingVerifications > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                {stats.pendingVerifications}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-medium text-sm md:text-base transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            👥 Пользователи
          </button>
        </div>
      </div>

      {/* Контент в зависимости от активной вкладки */}
      {activeTab === 'overview' && (
        <>
          {/* Статистика в сетке */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Всего пользователей"
              value={stats.totalUsers}
              icon="👥"
              color="blue"
              change={stats.newUsersToday}
              changeText="новых за сутки"
            />
            <StatCard
              title="Онлайн сейчас"
              value={stats.onlineUsers}
              icon="🟢"
              color="green"
              percentage={
                stats.totalUsers > 0
                  ? Math.round((stats.onlineUsers / stats.totalUsers) * 100)
                  : 0
              }
            />
            <StatCard title="Всего постов" value={stats.totalPosts} icon="📝" color="purple" />
            <StatCard
              title="Всего сообщений"
              value={stats.totalMessages}
              icon="💬"
              color="yellow"
            />
            <StatCard
              title="На верификации"
              value={stats.pendingVerifications}
              icon="⏳"
              color="orange"
              alert={stats.pendingVerifications > 0}
            />
            <StatCard
              title="Активность"
              value={`${
                stats.totalUsers > 0
                  ? Math.round((stats.onlineUsers / stats.totalUsers) * 100)
                  : 0
              }%`}
              icon="📊"
              color="pink"
              subtitle="пользователей онлайн"
            />
          </div>

          {/* Быстрые действия */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-blue-400">⚡</span> Быстрые действия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('verification')}
                className="bg-gray-900 hover:bg-gray-800 border border-gray-700 p-4 rounded-lg transition-colors text-left"
              >
                <div className="text-lg mb-2">✅</div>
                <div className="font-medium">Верификация пользователей</div>
                <div className="text-gray-400 text-sm mt-1">
                  {stats.pendingVerifications} ожидают подтверждения
                </div>
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 border border-gray-700 p-4 rounded-lg transition-colors text-left">
                <div className="text-lg mb-2">📢</div>
                <div className="font-medium">Создать объявление</div>
                <div className="text-gray-400 text-sm mt-1">
                  Отправить уведомление всем пользователям
                </div>
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 border border-gray-700 p-4 rounded-lg transition-colors text-left">
                <div className="text-lg mb-2">📈</div>
                <div className="font-medium">Подробная статистика</div>
                <div className="text-gray-400 text-sm mt-1">Графики активности и аналитика</div>
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'verification' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-orange-400">✅</span> Верификация пользователей
            </h2>
            <div className="text-sm text-gray-400">
              {pendingUsers.length} пользователей ожидают подтверждения
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-xl text-gray-300">Нет пользователей, ожидающих верификации</p>
              <p className="text-gray-500 mt-2">Все пользователи уже подтверждены!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {pendingUsers.map(user => (
                <div
                  key={user.id}
                  className="bg-gray-900/70 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">@{user.username}</span>
                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                              новый
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Зарегистрирован:{' '}
                            {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVerify(user.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        Подтвердить
                      </button>
                      <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium whitespace-nowrap">
                        Отклонить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-blue-400">👥</span> Управление пользователями
          </h2>
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🚧</div>
            <p className="text-xl text-gray-300">Раздел в разработке</p>
            <p className="text-gray-500 mt-2">
              Здесь будет список всех пользователей с возможностью управления правами и блокировки
            </p>
          </div>
        </div>
      )}

      {/* Футер */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>Административная панель Cunninghares • Версия 1.0.0</p>
        <p className="mt-1">Доступно только для администраторов системы</p>
      </div>
    </div>
  );
};

// Компонент карточки статистики
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: string;
  color: string;
  change?: number;
  changeText?: string;
  percentage?: number;
  alert?: boolean;
  subtitle?: string;
}> = ({ title, value, icon, color, change, changeText, percentage, alert, subtitle }) => {
  const colorClasses = {
    blue: 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-900/5',
    green: 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-900/5',
    purple: 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-purple-900/5',
    yellow: 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5',
    orange: 'border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-900/5',
    pink: 'border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-pink-900/5'
  };

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400'
  };

  return (
    <div
      className={`border rounded-xl p-5 ${
        colorClasses[color as keyof typeof colorClasses]
      } ${alert ? 'animate-pulse border-orange-500' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-gray-400 text-sm mb-1 font-medium">{title}</div>
          <div className="text-2xl md:text-3xl font-bold mb-2">{value}</div>
          {subtitle && <div className="text-gray-400 text-xs md:text-sm">{subtitle}</div>}

          {change !== undefined && (
            <div className="text-sm mt-2 flex items-center">
              <span className={`font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change > 0 ? '↑' : change < 0 ? '↓' : ''} {change > 0 ? '+' : ''}
                {change}
              </span>
              <span className="text-gray-400 ml-2">{changeText}</span>
            </div>
          )}

          {percentage !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Прогресс</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-800/70 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`text-2xl md:text-3xl ${iconColors[color as keyof typeof iconColors]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
