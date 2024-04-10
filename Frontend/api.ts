import axios from 'axios';

// Setup base URL from environment variable or default
const API_URL = 'http://192.168.1.23:3000'; // Use your backend's URL

const api = axios.create({
  baseURL: API_URL,
});

// Utility function to set the authorization header based on the saved token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Authentication API
export const authApi = {
  register: (data: { username: string; email: string; password: string }) => api.post('/users/register', data),
  login: (data: { username: string; password: string }) => api.post('/users/login', data),
  logout: () => api.get('/users/logout'),
};

// Posts API - Adjusted for infinite scrolling
export const postApi = {
  fetchPosts: (page = 1, limit = 3) => api.get(`/posts?page=${page}&limit=${limit}`), // Example endpoint for fetching posts with pagination
  createPost: (data: { content: string; photo?: string }) => api.post('/posts', data),
  likePost: (postId: string) => api.post(`/posts/${postId}/like`),
};

export default api;
