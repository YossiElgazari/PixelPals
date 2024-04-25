export interface UserModel {
    _id: string;
    username: string;
    email: string;
    bio?: string; // Optional since not all users may have a bio
    profilePicture?: string; // Optional for cases where the user might not have set a profile picture
    postsCount: number;
    followersCount: number;
    followingCount: number;
  }