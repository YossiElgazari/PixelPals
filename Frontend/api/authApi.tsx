import clientApi  from './clientApi';

export const authApi = {
    register: (data: { username: string; email: string; password: string }) => clientApi.post('/users/register', data),
    login: (data: { username: string; password: string }) => clientApi.post('/users/login', data),
    logout: () => clientApi.get('/users/logout'),
    getUserProfile: () => clientApi.get('/users/profile'),
    updateUserProfile: (data: { username: string; email: string }) => clientApi.put('/users/profile', data),
  };

  export const setAuthToken = (token: string | null) => {
    if (token) {
      clientApi.defaults.headers.common['authorization'] = `Bearer ${token}`;
    } else {
      delete clientApi.defaults.headers.common['authorization'];
    }
  };