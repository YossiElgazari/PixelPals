import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStorage from "../utility/secureStorage";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import clientApi from "../api/clientApi";

export const setAuthToken = (accessToken: string) => {
  console.log("Setting auth token:", accessToken);
  if (accessToken) {
    axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    clientApi.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    console.log("Auth tokens set:", { accessToken });
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};

interface AuthProps {
  authState?: {
    userId: string;
    accessToken: string | null;
    authenticated: boolean | null;
  };
  onRegister?: (
    username: string,
    password: string,
    email: string,
    profilePicture?: string
  ) => Promise<any>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    userId: string;
    accessToken: string | null;
    authenticated: boolean | null;
  }>({
    userId: "",
    accessToken: null,
    authenticated: null,
  });

  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const accessToken = await SecureStorage.getAccessToken();
        if (accessToken) {
          setAuthToken(accessToken);  
          const response = await userApi.getUserId();
          const userId = response.data.userId;
          setAuthState({
            userId: userId,
            accessToken,
            authenticated: true,
          });
        } else {
          setAuthState({
            userId: "",
            accessToken: null,
            authenticated: false,
          });
          setAuthToken('');
        }
      } catch (error) {
        console.log("Failed to fetch auth state:", error);
        setAuthState({
          userId: "",
          accessToken: null,
          authenticated: false,
        });
      }
    };

    fetchAuthState();
  }, []);

  const register = async (
    username: string,
    password: string,
    email: string,
    profilePicture?: string
  ) => {
    try {
      if (!profilePicture) {
        profilePicture = ""
      }
      const response = await authApi.register({ username, password, email, profilePicture });
      console.log("Register response:", response);
      return response;
    } catch (error: any) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      if (response.data.accessToken && response.data.refreshToken) {
        await SecureStorage.secureTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        setAuthToken(response.data.accessToken);
        setAuthState({
          userId: response.data.userId,
          accessToken: response.data.accessToken,
          authenticated: true,
        });
      }
      return response;
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await SecureStorage.getRefreshToken();
      console.log("Logging out with refresh token:", refreshToken);
      const response = await authApi.logout({ refreshToken });
      await SecureStorage.RemoveTokens();
      delete axios.defaults.headers["Authorization"];
      setAuthState({
        userId: "",
        accessToken: null,
        authenticated: false,
      });
      return response;
    } catch (error: any) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
