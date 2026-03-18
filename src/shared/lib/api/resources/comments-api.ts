import { apiDelete, apiGet, apiPost, apiPut, type ApiRequestBody } from '@/shared/lib/api/api-client';

export const commentsApi = {
  listByPost: <T = unknown>(postId: string) => apiGet<T[]>(`/posts/${postId}/comments`),
  createForPost: <T = unknown>(postId: string, body: ApiRequestBody) =>
    apiPost<T>(`/posts/${postId}/comments`, body),
  getById: <T = unknown>(commentId: string) => apiGet<T>(`/comments/${commentId}`),
  update: <T = unknown>(commentId: string, body: ApiRequestBody) =>
    apiPut<T>(`/comments/${commentId}`, body),
  remove: <T = unknown>(commentId: string) => apiDelete<T>(`/comments/${commentId}`),
};
