import axios from 'axios';

const API_URL = 'http://192.168.1.23:3000';

const clientApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/vnd.github.v3+json',
  },
});

export default clientApi;
