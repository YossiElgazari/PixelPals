import React, { createContext, useState, useEffect } from 'react';
import { authApi, setAuthToken } from '../api/authApi';
import LoadingSpinner from '../components/loading';
import EncryptedStorage from 'react-native-encrypted-storage';

interface User {
  accessToken: string;
  refreshToken: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultState: UserContextType = {
  user: null,
  loading: true,
  login: async () => { },
  logout: async () => { },
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
      const userData = await EncryptedStorage.getItem('user');
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
        const userData = { username, accessToken, refreshToken };
        await Promise.all([
          EncryptedStorage.setItem('accessToken', accessToken),
          EncryptedStorage.setItem('refreshToken', refreshToken),
          EncryptedStorage.setItem('user', JSON.stringify(userData))
        ]);
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
    setLoading(true);
    try {
      if (user) {
        await authApi.logout({ refreshToken: user.refreshToken });
        await EncryptedStorage.removeItem('user');
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        setUser(null);
        setAuthToken('', '');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    setLoading(false);
  };


  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {loading && <LoadingSpinner />}
      {children}
    </UserContext.Provider>
  );
};

  export default UserContext;