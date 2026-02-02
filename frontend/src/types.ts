export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  isAdmin?: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
}