import { apiDelete, apiGet, apiPost, apiPut, buildQueryString, type ApiRequestBody } from '@/shared/lib/api/api-client';

type TrailListParams = {
  limit?: number;
  cursor?: string | null;
};

export const trailsApi = {
  list: <T = unknown>({ limit, cursor }: TrailListParams = {}) =>
    apiGet<T>(`/trails${buildQueryString({ limit, cursor })}`),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/trails', body),
  getById: <T = unknown>(trailId: string) => apiGet<T>(`/trails/${trailId}`),
  update: <T = unknown>(trailId: string, body: ApiRequestBody) => apiPut<T>(`/trails/${trailId}`, body),
  remove: <T = unknown>(trailId: string) => apiDelete<T>(`/trails/${trailId}`),
};
