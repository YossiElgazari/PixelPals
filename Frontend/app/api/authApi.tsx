import clientApi from "./clientApi";
import { secureTokens, RemoveTokens } from "../utility/secureStorage";

export const authApi = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
  }) => {
    console.log("Attempting to register user:", data);
    try {
      const response = await clientApi.post("/auth/register", data);
      console.log("Registration successful:", response.data);
      return response;
    } catch (error: any) {
      console.log(
        "Registration failed:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  },
  login: async (data: { username: string; password: string }) => {
    console.log("Attempting to log in user:", data);
    try {
      const response = await clientApi.post("/auth/login", data);
      if (response.data.accessToken && response.data.refreshToken) {
        await secureTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        clientApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
      }
      return response;
    } catch (error: any) {
      console.log(
        "Login failed:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  },
  logout: async (data: { refreshToken: string }) => {
    console.log("Attempting to log out user");
    try {
      const response = await clientApi.post("/auth/logout", data);
      await RemoveTokens();
      delete clientApi.defaults.headers.common["Authorization"];
      return response;
    } catch (error: any) {
      console.log(
        "Logout failed:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  },
};


