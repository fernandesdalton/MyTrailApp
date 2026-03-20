import { apiDelete, apiGet, apiPost, apiPut, buildQueryString, type ApiRequestBody } from '@/shared/lib/api/api-client';

type TrailListParams = {
  limit?: number;
  cursor?: string | null;
};

export const usersApi = {
  list: <T = unknown>() => apiGet<T[]>('/users'),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/users', body),
  getById: <T = unknown>(userId: string) => apiGet<T>(`/users/${userId}`),
  update: <T = unknown>(userId: string, body: ApiRequestBody) => apiPut<T>(`/users/${userId}`, body),
  remove: <T = unknown>(userId: string) => apiDelete<T>(`/users/${userId}`),
  listPosts: <T = unknown>(userId: string) => apiGet<T[]>(`/users/${userId}/posts`),
  listTrails: <T = unknown>(userId: string, { limit, cursor }: TrailListParams = {}) =>
    apiGet<T>(`/users/${userId}/trails${buildQueryString({ limit, cursor })}`),
  listSavedTrails: <T = unknown>(userId: string, { limit, cursor }: TrailListParams = {}) =>
    apiGet<T>(`/users/${userId}/saved-trails${buildQueryString({ limit, cursor })}`),
  getSavedTrail: <T = unknown>(userId: string, trailId: string) =>
    apiGet<T>(`/users/${userId}/saved-trails/${trailId}`),
};
