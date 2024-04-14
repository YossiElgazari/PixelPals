import clientApi from "./clientApi";

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    clientApi.post("/auth/register", data),
  login: (data: { username: string; password: string }) =>
    clientApi.post("/auth/login", data),
  logout: () => clientApi.get("/auth/logout"),
};

export const setAuthToken = (accessToken: string, refreshToken: string) => {
  if (accessToken && refreshToken) {
    clientApi.defaults.headers.common["authorization"] = `${accessToken}`;
    clientApi.defaults.headers.common["refreshToken"] = refreshToken;
  } else {
    delete clientApi.defaults.headers.common["authorization"];
    delete clientApi.defaults.headers.common["refreshToken"];
  }
};
