import clientApi from "./clientApi";

export const postApi = {
    fetchPosts: () => clientApi.get('/post'),
    createPost: (data: { content: string; photo?: string }) => clientApi.post('/posts', data),
    likePost: (postId: string) => clientApi.post(`/posts/${postId}/like`),
    unlikePost: (postId: string) => clientApi.delete(`/posts/${postId}/like`),
    deletePost: (postId: string) => clientApi.delete(`/posts/${postId}`),
    updatePost: (postId: string, data: { content: string }) => clientApi.put(`/posts/${postId}`, data),
    getAllUserPosts: (userId: string) => clientApi.get(`/posts/user/${userId}`),
  };