import clientApi from "./clientApi";

export const postApi = {
    fetchPosts: () => clientApi.get('/post'),
    createPost: (data: { content: string; photo?: string }) => clientApi.post('/post', data),
    likePost: (postId: string) => clientApi.post(`/post/${postId}/like`),
    unlikePost: (postId: string) => clientApi.delete(`/post/${postId}/like`),
    deletePost: (postId: string) => clientApi.delete(`/post/${postId}`),
    updatePost: (postId: string, data: { content: string }) => clientApi.put(`/post/${postId}`, data),
    getAllUserPosts: (userId: string) => clientApi.get(`/post/user/${userId}`),
  };