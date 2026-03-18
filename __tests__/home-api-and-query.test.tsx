/* eslint-disable import/first */
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { getFeedPosts } from '@/features/home/api/get-feed-posts';
import { getHomeStories } from '@/features/home/api/get-home-stories';
import { useFeedPostsQuery } from '@/features/home/queries/use-feed-posts-query';

jest.mock('@/shared/lib/api/api-client', () => ({
  apiGet: jest.fn(),
}));

import { apiGet } from '@/shared/lib/api/api-client';

const apiGetMock = apiGet as unknown as jest.MockedFunction<(path: string) => Promise<unknown>>;

function QueryProbe() {
  const { data, isSuccess } = useFeedPostsQuery();
  return <Text>{isSuccess ? JSON.stringify(data) : 'loading'}</Text>;
}

describe('home feed api and query', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns api feed data when request succeeds', async () => {
    apiGetMock.mockResolvedValue([
      {
        id: '99999999-9999-4999-8999-999999999999',
        caption: 'Trail day',
        createdAt: new Date().toISOString(),
        media: [{ type: 'image', url: 'https://example.com/feed.jpg', width: 1200, height: 1500 }],
        likesCount: 3,
        commentsCount: 1,
        isLiked: false,
        author: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'dusty',
          displayName: 'Dusty Rider',
        },
        trail: {
          id: '22222222-2222-4222-8222-222222222222',
          title: 'Dusty Loop',
          distanceMeters: 10200,
          durationSeconds: 5400,
          elevationGainMeters: 320,
        },
      },
    ]);
    await expect(getFeedPosts()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '99999999-9999-4999-8999-999999999999',
          userName: 'Dusty Rider',
          handle: '@dusty',
        }),
      ])
    );
  });

  it('falls back to local feed data when request fails', async () => {
    apiGetMock.mockRejectedValue(new Error('offline'));
    const posts = await getFeedPosts();
    expect(posts).toHaveLength(3);
    expect(posts[0]?.trailName).toBeTruthy();
  });

  it('returns story feed data when request succeeds', async () => {
    apiGetMock.mockResolvedValue([
      {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        author: {
          id: '11111111-1111-4111-8111-111111111111',
          displayName: 'Dusty Rider',
        },
      },
    ]);

    await expect(getHomeStories()).resolves.toEqual([
      {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        label: 'Dusty Rider',
        color: expect.any(String),
      },
    ]);
  });

  it('falls back to local stories when story request fails', async () => {
    apiGetMock.mockRejectedValue(new Error('offline'));
    const stories = await getHomeStories();
    expect(stories).toHaveLength(4);
    expect(stories[0]?.label).toBeTruthy();
  });

  it('runs the feed query hook successfully', async () => {
    apiGetMock.mockResolvedValue([
      {
        id: '99999999-9999-4999-8999-999999999999',
        caption: 'Trail day',
        createdAt: new Date().toISOString(),
        media: [{ type: 'image', url: 'https://example.com/feed.jpg', width: 1200, height: 1500 }],
        likesCount: 3,
        commentsCount: 1,
        isLiked: false,
        author: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'dusty',
          displayName: 'Dusty Rider',
        },
        trail: {
          id: '22222222-2222-4222-8222-222222222222',
          title: 'Trail',
          distanceMeters: 1000,
          durationSeconds: 900,
          elevationGainMeters: 50,
        },
      },
    ]);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
      },
    });
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <QueryProbe />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(getByText(/"trailName":"TRAIL"/)).toBeTruthy()
    );
    queryClient.clear();
  });
});
