import clientApi from "./clientApi";

export const authApi = {
  register: async (data: { username: string; email: string; passwordHash: string; profilePicture?: string }) => {
    console.log("Attempting to register user:", data);
    try {
      const response = await clientApi.post("/auth/register", data);
      console.log("Registration successful:", response.data);
      return response;
    } catch (error : any) {
      console.error("Registration failed:", error.response ? error.response.data : error);
      throw error;
    }
  },
  login: async (data: { username: string; password: string }) => {
    console.log("Attempting to log in user:", data);
    try {
      const response = await clientApi.post("/auth/login", data);
      console.log("Login successful:", response.data);
      return response;
    } catch (error : any) {
      console.error("Login failed:", error.response ? error.response.data : error);
      throw error;
    }
  },
  logout: async (data: {refreshToken: string}) => {
    console.log("Attempting to log out user");
    try {
      const response = await clientApi.post("/auth/logout",data);
      console.log("Logout successful:", response.data);
      return response;
    } catch (error : any) {
      console.error("Logout failed:", error.response ? error.response.data : error);
      throw error;
    }
  },
  refreshTokens: async (refreshToken: string) => {
    console.log("Attempting to refresh tokens with refreshToken:", refreshToken);
    try {
      clientApi.defaults.headers.common["authorization"] = refreshToken;
      const response = await clientApi.get("/auth/refresh");
      console.log("Token refresh successful:", response.data);
      return response;
    } catch (error : any) {
      console.error("Token refresh failed:", error.response ? error.response.data : error);
      throw error;
    }
  },
};

export const setAuthToken = (accessToken: string, refreshToken: string) => {
  console.log("Setting auth tokens");
  if (accessToken && refreshToken) {
    clientApi.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    clientApi.defaults.headers.common["refreshToken"] = refreshToken;
    console.log("Auth tokens set:", { accessToken, refreshToken });
  } else {
    delete clientApi.defaults.headers.common["Authorization"];
    delete clientApi.defaults.headers.common["refreshToken"];
  }
};
