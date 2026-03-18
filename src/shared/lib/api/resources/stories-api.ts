import { apiDelete, apiGet, apiPost, apiPut, type ApiRequestBody } from '@/shared/lib/api/api-client';

export const storiesApi = {
  list: <T = unknown>() => apiGet<T[]>('/stories'),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/stories', body),
  getById: <T = unknown>(storyId: string) => apiGet<T>(`/stories/${storyId}`),
  update: <T = unknown>(storyId: string, body: ApiRequestBody) => apiPut<T>(`/stories/${storyId}`, body),
  remove: <T = unknown>(storyId: string) => apiDelete<T>(`/stories/${storyId}`),
};
