import { User } from '../types';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/auth`;

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface VerifyData {
  email: string;
  code: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.error || 'Ошибка запроса';
  } catch {
    return 'Ошибка запроса';
  }
};

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return response.json();
  },

  async verifyEmail(data: VerifyData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return response.json();
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
