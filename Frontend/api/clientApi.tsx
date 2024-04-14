import axios from 'axios';

const API_URL = 'http://192.168.1.23:3000';

const clientApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.get('/auth/refresh'); // Adjust this call as necessary
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default clientApi;
