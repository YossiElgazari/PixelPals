import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, setAuthToken } from '../api/authApi';

interface User {
  accessToken: string;
  refreshToken: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;  // No parameter expected
  refreshTokens: () => Promise<void>;
}

const defaultState: UserContextType = {
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshTokens: async () => {}
};

const UserContext = createContext<UserContextType>(defaultState);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const currentUser: User = JSON.parse(userData);
        setUser(currentUser);
        setAuthToken(currentUser.accessToken, currentUser.refreshToken);
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ username, password });
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        const userData = { accessToken, refreshToken, username };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setAuthToken(accessToken, refreshToken);
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      if (user) {
        await authApi.logout({ refreshToken: user.refreshToken });
        await AsyncStorage.removeItem('user');
        setUser(null);
        setAuthToken('', '');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshTokens = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const { refreshToken } = JSON.parse(userData);
        const response = await authApi.refreshTokens(refreshToken);
        if (response.status === 200) {
          const { accessToken, newRefreshToken } = response.data;
          await AsyncStorage.setItem('user', JSON.stringify({ ...JSON.parse(userData), accessToken, refreshToken: newRefreshToken }));
          setUser(prev => ({ ...prev!, accessToken, refreshToken: newRefreshToken }));
          setAuthToken(accessToken, newRefreshToken);
        } else {
          throw new Error("Failed to refresh tokens");
        }
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      alert('Session expired. Please login again.');
      await logout();
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshTokens }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
