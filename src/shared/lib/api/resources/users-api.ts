import { apiDelete, apiGet, apiPost, apiPut, type ApiRequestBody } from '@/shared/lib/api/api-client';

export const usersApi = {
  list: <T = unknown>() => apiGet<T[]>('/users'),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/users', body),
  getById: <T = unknown>(userId: string) => apiGet<T>(`/users/${userId}`),
  update: <T = unknown>(userId: string, body: ApiRequestBody) => apiPut<T>(`/users/${userId}`, body),
  remove: <T = unknown>(userId: string) => apiDelete<T>(`/users/${userId}`),
  listPosts: <T = unknown>(userId: string) => apiGet<T[]>(`/users/${userId}/posts`),
  listTrails: <T = unknown>(userId: string) => apiGet<T[]>(`/users/${userId}/trails`),
};
