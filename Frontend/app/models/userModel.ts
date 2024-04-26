export interface UserModel {
    _id: string;
    username: string;
    email: string;
    bio: string | ""; 
    profilePicture: string | ""; 
    postsCount: number;
    followersCount: number;
    followingCount: number;
  }