import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  buildQueryString,
  type ApiRequestBody,
} from '@/shared/lib/api/api-client';

type StoryListParams = {
  viewerId: string;
  limit?: number;
  cursor?: string | null;
};

export const storiesApi = {
  list: <T = unknown>({ viewerId, limit, cursor }: StoryListParams) =>
    apiGet<T>(`/stories${buildQueryString({ viewerId, limit, cursor })}`),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/stories', body),
  getById: <T = unknown>(storyId: string) => apiGet<T>(`/stories/${storyId}`),
  update: <T = unknown>(storyId: string, body: ApiRequestBody) => apiPut<T>(`/stories/${storyId}`, body),
  remove: <T = unknown>(storyId: string) => apiDelete<T>(`/stories/${storyId}`),
};
