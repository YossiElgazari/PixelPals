import axios from "axios";
import { getRereshToken, secureTokens } from "../utility/secureStorage";

const API_URL = "http://192.168.1.23:3000";

const clientApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await getRereshToken();
      if (refreshToken) {
        try {
          const { data } = await clientApi.post("/auth/refresh", {
            refreshToken,
          });
          await secureTokens(data.accessToken, data.refreshToken);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.accessToken;
          originalRequest.headers["Authorization"] =
            "Bearer " + data.accessToken;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Refresh Token Error:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default clientApi;
