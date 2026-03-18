import { apiDelete, apiGet, apiPost, apiPut, type ApiRequestBody } from '@/shared/lib/api/api-client';

export const trailsApi = {
  list: <T = unknown>() => apiGet<T[]>('/trails'),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/trails', body),
  getById: <T = unknown>(trailId: string) => apiGet<T>(`/trails/${trailId}`),
  update: <T = unknown>(trailId: string, body: ApiRequestBody) => apiPut<T>(`/trails/${trailId}`, body),
  remove: <T = unknown>(trailId: string) => apiDelete<T>(`/trails/${trailId}`),
};
