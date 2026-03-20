import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  buildQueryString,
  type ApiRequestBody,
} from '@/shared/lib/api/api-client';

type FeedListParams = {
  viewerId: string;
  limit?: number;
  cursor?: string | null;
};

export const postsApi = {
  list: <T = unknown>({ viewerId, limit, cursor }: FeedListParams) =>
    apiGet<T>(`/feed${buildQueryString({ viewerId, limit, cursor })}`),
  create: <T = unknown>(body: ApiRequestBody) => apiPost<T>('/posts', body),
  uploadPhoto: <T = unknown>(postId: string, body: ApiRequestBody) =>
    apiPost<T>(`/posts/${postId}/photos/upload`, body),
  listPhotos: <T = unknown>(postId: string) => apiGet<T>(`/posts/${postId}/photos`),
  listUserPhotos: <T = unknown>(userId: string) => apiGet<T>(`/users/${userId}/photos`),
  getById: <T = unknown>(postId: string) => apiGet<T>(`/posts/${postId}`),
  update: <T = unknown>(postId: string, body: ApiRequestBody) => apiPut<T>(`/posts/${postId}`, body),
  remove: <T = unknown>(postId: string) => apiDelete<T>(`/posts/${postId}`),
};
