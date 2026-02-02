import { User } from '../types';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/admin`;

// Получение токена из localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Общая функция для запросов
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Добавляем токен, если есть
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Токен недействителен, очищаем localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Ошибка авторизации. Пожалуйста, войдите снова.');
    }

    try {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка запроса');
    } catch {
      throw new Error('Ошибка запроса');
    }
  }

  return response.json();
};

export const adminApi = {
  async getStats() {
    return makeRequest('/stats');
  },

  async getPendingVerifications(): Promise<User[]> {
    return makeRequest('/pending-verifications');
  },

  async verifyUser(userId: string) {
    return makeRequest(`/verify/${userId}`, {
      method: 'PUT',
    });
  },

  // Эти эндпоинты должны быть в backend, иначе будут 404:
  async getUsers(): Promise<User[]> {
    return makeRequest('/users');
  },

  async deleteUser(userId: string) {
    return makeRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
