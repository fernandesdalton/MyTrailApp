import { apiDelete, apiGet, apiPost, apiPut, type ApiRequestBody } from '@/shared/lib/api/api-client';

export const postsApi = {
  list: <T = unknown>() => apiGet<T[]>('/posts'),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/posts', body),
  getById: <T = unknown>(postId: string) => apiGet<T>(`/posts/${postId}`),
  update: <T = unknown>(postId: string, body: ApiRequestBody) => apiPut<T>(`/posts/${postId}`, body),
  remove: <T = unknown>(postId: string) => apiDelete<T>(`/posts/${postId}`),
};
