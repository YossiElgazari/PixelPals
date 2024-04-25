import axios from "axios";
import { getRefreshToken, secureTokens } from "../utility/secureStorage";

export const API_URL = "http://192.168.1.23:3000";

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
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await getRefreshToken();
      console.log("Refresh Token:", refreshToken);
      axios.defaults.headers["Authorization"] = "Bearer " + refreshToken;
      clientApi.defaults.headers["Authorization"] = "Bearer " + refreshToken;
      if (refreshToken) {
        try {
          const { data } = await clientApi.get("/auth/refresh");
          console.log("New Tokens:", data);
          await secureTokens(data.accessToken, data.refreshToken);
          axios.defaults.headers["Authorization"] =
            "Bearer " + data.accessToken;
          originalRequest.headers["Authorization"] =
            "Bearer " + data.accessToken;
          clientApi.defaults.headers["Authorization"] =
            "Bearer " + data.accessToken;
          return axios(originalRequest);
        } catch (refreshError) {
          console.log("Refresh Token Error:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default clientApi;
