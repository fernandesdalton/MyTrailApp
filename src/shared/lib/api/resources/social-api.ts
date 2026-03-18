import { apiDelete, apiPost, buildQueryString } from '@/shared/lib/api/api-client';

export const socialApi = {
  followUser: <T = unknown>(userId: string, followerId: string) =>
    apiPost<T>(`/users/${userId}/follow${buildQueryString({ followerId })}`),
  unfollowUser: <T = unknown>(userId: string, followerId: string) =>
    apiDelete<T>(`/users/${userId}/follow${buildQueryString({ followerId })}`),
  likePost: <T = unknown>(postId: string, userId: string) =>
    apiPost<T>(`/posts/${postId}/likes${buildQueryString({ userId })}`),
  unlikePost: <T = unknown>(postId: string, userId: string) =>
    apiDelete<T>(`/posts/${postId}/likes${buildQueryString({ userId })}`),
  saveTrail: <T = unknown>(trailId: string, userId: string) =>
    apiPost<T>(`/trails/${trailId}/save${buildQueryString({ userId })}`),
  unsaveTrail: <T = unknown>(trailId: string, userId: string) =>
    apiDelete<T>(`/trails/${trailId}/save${buildQueryString({ userId })}`),
  markStoryViewed: <T = unknown>(storyId: string, viewerId: string) =>
    apiPost<T>(`/stories/${storyId}/views${buildQueryString({ viewerId })}`),
};
