import clientApi from "./clientApi";

export const postApi = {
    fetchPosts: () => clientApi.get('/post'),
    createPost: (data: { content: string; photo?: string }) => clientApi.post('/post', data),
    likePost: (postId: string) => clientApi.put(`/post/like/${postId}`),
    unlikePost: (postId: string) => clientApi.put(`/post/unlike/${postId}`),
    deletePost: (postId: string) => clientApi.delete(`/post/${postId}`),
    updatePost: (postId: string, data: { content?: string, photo?: string }) => clientApi.put(`/post/${postId}`, data),
    getAllUserPosts: (userId: string) => clientApi.get(`/post/user/${userId}`),
  };