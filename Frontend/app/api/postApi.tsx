import clientApi from "./clientApi";
import { authApi } from "./authApi";

export const postApi = {
    fetchPosts: () => clientApi.get('/post'),
    createPost: async(data: { content: string; photo?: string }) => {
        if (data.photo) {
            const newfilename = await authApi.uploadImage(data.photo);
            data.photo = newfilename;
        }
        return clientApi.post('/post', data);
    },
    likePost: (postId: string) => clientApi.put(`/post/like/${postId}`),
    unlikePost: (postId: string) => clientApi.put(`/post/unlike/${postId}`),
    deletePost: (postId: string) => clientApi.delete(`/post/${postId}`),
    updatePost: async (postId: string, data: { content?: string, photo?: string }) => {
        if (data.photo) {
            const newfilename = await authApi.uploadImage(data.photo);
            data.photo = newfilename;
        }
        return clientApi.put(`/post/${postId}`, data);
    },
    getAllUserPosts: (userId: string) => clientApi.get(`/post/user/${userId}`),
  };