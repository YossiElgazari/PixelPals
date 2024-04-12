import clientApi from "./clientApi";

export const postApi = {
    fetchPosts: (page = 1, limit = 3) => clientApi.get(`/posts?page=${page}&limit=${limit}`), // Example endpoint for fetching posts with pagination
    createPost: (data: { content: string; photo?: string }) => clientApi.post('/posts', data),
    likePost: (postId: string) => clientApi.post(`/posts/${postId}/like`),
    unlikePost: (postId: string) => clientApi.delete(`/posts/${postId}/like`),
    deletePost: (postId: string) => clientApi.delete(`/posts/${postId}`),
    updatePost: (postId: string, data: { content: string }) => clientApi.put(`/posts/${postId}`, data),
    getAllUserPosts: (userId: string) => clientApi.get(`/posts/user/${userId}`),
  };