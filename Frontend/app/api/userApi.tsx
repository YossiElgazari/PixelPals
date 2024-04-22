import clientApi from "./clientApi";

export const userApi = {
  getUserProfile: () => clientApi.get("/user/profile"),
  updateUserProfile: (data: { username: string; email: string; bio: string; profilePicture: string}) =>
    clientApi.put("/user/profile", data),
  updateProfilePicture: (data: { profilePicture: string }) =>
    clientApi.put("/user/profilePicture", data),
  updatePassword: (data: { oldPassword: string; newPassword: string }) =>
    clientApi.put("/user/reset-password", data),
  getUserById: (userId: string) => clientApi.get(`/user/${userId}`),
  deleteUser: () => clientApi.delete("/user"),
};
