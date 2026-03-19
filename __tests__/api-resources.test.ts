/* eslint-disable import/first */
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@/shared/lib/api/api-client', () => {
  const actual = jest.requireActual<typeof import('@/shared/lib/api/api-client')>(
    '@/shared/lib/api/api-client'
  );

  return {
    apiGet: jest.fn((path: string) => ({ method: 'GET', path })),
    apiPost: jest.fn((path: string, body?: unknown) => ({ method: 'POST', path, body })),
    apiPut: jest.fn((path: string, body?: unknown) => ({ method: 'PUT', path, body })),
    apiDelete: jest.fn((path: string) => ({ method: 'DELETE', path })),
    buildQueryString: actual.buildQueryString,
  };
});

import { commentsApi, postsApi, socialApi, storiesApi, trailsApi, usersApi } from '@/shared/lib/api/resources';

describe('api resources', () => {
  it('maps user endpoints correctly', () => {
    expect(usersApi.list()).toEqual({ method: 'GET', path: '/users' });
    expect(usersApi.create({ name: 'a' })).toEqual({ method: 'POST', path: '/users', body: { name: 'a' } });
    expect(usersApi.getById('1')).toEqual({ method: 'GET', path: '/users/1' });
    expect(usersApi.update('1', { name: 'b' })).toEqual({ method: 'PUT', path: '/users/1', body: { name: 'b' } });
    expect(usersApi.remove('1')).toEqual({ method: 'DELETE', path: '/users/1' });
    expect(usersApi.listPosts('1')).toEqual({ method: 'GET', path: '/users/1/posts' });
    expect(usersApi.listTrails('1')).toEqual({ method: 'GET', path: '/users/1/trails' });
  });

  it('maps trail, post, comment, and story endpoints correctly', () => {
    expect(trailsApi.list()).toEqual({ method: 'GET', path: '/trails' });
    expect(trailsApi.getById('t1')).toEqual({ method: 'GET', path: '/trails/t1' });
    expect(postsApi.list()).toEqual({ method: 'GET', path: '/posts' });
    expect(postsApi.getById('p1')).toEqual({ method: 'GET', path: '/posts/p1' });
    expect(commentsApi.listByPost('p1')).toEqual({ method: 'GET', path: '/posts/p1/comments' });
    expect(commentsApi.getById('c1')).toEqual({ method: 'GET', path: '/comments/c1' });
    expect(storiesApi.list()).toEqual({ method: 'GET', path: '/stories/all' });
    expect(storiesApi.getById('s1')).toEqual({ method: 'GET', path: '/stories/s1' });
  });

  it('maps social endpoints with query parameters correctly', () => {
    expect(socialApi.followUser('u1', 'u2')).toEqual({
      method: 'POST',
      path: '/users/u1/follow?followerId=u2',
      body: undefined,
    });
    expect(socialApi.unfollowUser('u1', 'u2')).toEqual({
      method: 'DELETE',
      path: '/users/u1/follow?followerId=u2',
    });
    expect(socialApi.likePost('p1', 'u1')).toEqual({
      method: 'POST',
      path: '/posts/p1/likes?userId=u1',
      body: undefined,
    });
    expect(socialApi.unlikePost('p1', 'u1')).toEqual({
      method: 'DELETE',
      path: '/posts/p1/likes?userId=u1',
    });
    expect(socialApi.saveTrail('t1', 'u1')).toEqual({
      method: 'POST',
      path: '/trails/t1/save?userId=u1',
      body: undefined,
    });
    expect(socialApi.unsaveTrail('t1', 'u1')).toEqual({
      method: 'DELETE',
      path: '/trails/t1/save?userId=u1',
    });
    expect(socialApi.markStoryViewed('s1', 'u1')).toEqual({
      method: 'POST',
      path: '/stories/s1/views?viewerId=u1',
      body: undefined,
    });
  });
});
