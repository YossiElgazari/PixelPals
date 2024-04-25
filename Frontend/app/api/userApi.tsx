import clientApi from "./clientApi";

export const userApi = {
  getUserProfile: () => clientApi.get("/user/profile"),
  getUserProfileById: (userId: string) => clientApi.get(`/user/profile/${userId}`),
  updateUserProfile: (data: { username: string; email: string; bio: string; profilePicture: string}) =>
    clientApi.put("/user/profile", data),
  updateProfilePicture: (data: { profilePicture: string }) =>
    clientApi.put("/user/profilePicture", data),
  updatePassword: (data: { oldPassword: string; newPassword: string }) =>
    clientApi.put("/user/reset-password", data),
  getUserById: (userId: string) => clientApi.get(`/user/${userId}`),
  deleteUser: () => clientApi.delete("/user"),
  searchUsers: (query: string) => clientApi.get(`/user/search/${query}`),
  followUser: (userId: string) => clientApi.put(`/user/follow/${userId}`),
  unfollowUser: (userId: string) => clientApi.put(`/user/unfollow/${userId}`),
  getFollowers: (userId: string) => clientApi.get(`/user/followers/${userId}`),
  getFollowing: (userId: string) => clientApi.get(`/user/following/${userId}`),
};
