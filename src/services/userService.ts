
import { User } from '@/types';

// Simple user service for nickname management using localStorage
const STORAGE_KEY = 'quiet_space_user';

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setNickname = (nickname: string): User => {
  const user: User = { nickname };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
