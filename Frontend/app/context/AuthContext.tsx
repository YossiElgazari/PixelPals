import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStorage from "../utility/secureStorage";
import { authApi } from "../api/authApi";
import clientApi from "../api/clientApi";

export const setAuthToken = (accessToken: string) => {
  console.log("Setting auth token:", accessToken);
  if (accessToken) {
    axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    clientApi.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    console.log("Auth tokens set:", { accessToken });
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

interface AuthProps {
  authState?: { accessToken: string | null; authenticated: boolean | null };
  onRegister?: (
    username: string,
    password: string,
    email: string
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
    accessToken: string | null;
    authenticated: boolean | null;
  }>({
    accessToken: null,
    authenticated: null,
  });

  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const accessToken = await SecureStorage.getAccessToken();
        if (accessToken) {
          setAuthToken(accessToken);
          setAuthState({
            accessToken,
            authenticated: true,
          });
        } else {
          setAuthState({
            accessToken: null,
            authenticated: false,
          });
        }
      } catch (error: any) {
        console.log("Failed to fetch auth state:", error);
      }
    };
    fetchAuthState();
  }, []);

  const register = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const response = await authApi.register({ username, password, email });
      console.log("Register response:", response);
      return response;
    } catch (error: any) {
      console.log(
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
          accessToken: response.data.accessToken,
          authenticated: true,
        });
      }
      return response;
    } catch (error: any) {
      console.log(
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
      delete axios.defaults.headers.common["Authorization"];
      setAuthState({
        accessToken: null,
        authenticated: false,
      });
      return response;
    } catch (error: any) {
      console.log(
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
