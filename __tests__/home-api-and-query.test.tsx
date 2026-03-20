/* eslint-disable import/first */
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { getFeedPosts } from '@/features/home/api/get-feed-posts';
import { getHomeStories } from '@/features/home/api/get-home-stories';
import { useFeedPostsQuery } from '@/features/home/queries/use-feed-posts-query';
import { resetAllTrailsCache } from '@/shared/lib/api/resources/get-all-trails';

jest.mock('@/shared/lib/api/api-client', () => ({
  ...jest.requireActual<typeof import('@/shared/lib/api/api-client')>('@/shared/lib/api/api-client'),
  apiGet: jest.fn(),
}));

import { apiGet } from '@/shared/lib/api/api-client';

const apiGetMock = apiGet as unknown as jest.MockedFunction<(path: string) => Promise<unknown>>;
const viewerId = 'viewer-1';

function QueryProbe() {
  const { data, isSuccess } = useFeedPostsQuery(viewerId);
  return <Text>{isSuccess ? JSON.stringify(data?.pages.flatMap((page) => page.items)) : 'loading'}</Text>;
}

describe('home feed api and query', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetAllTrailsCache();
  });

  it('returns api feed data when request succeeds', async () => {
    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/feed?viewerId=viewer-1&limit=10') {
        return {
          items: [
            {
              id: '99999999-9999-4999-8999-999999999999',
              authorId: '11111111-1111-4111-8111-111111111111',
              trailId: '22222222-2222-4222-8222-222222222222',
              caption: 'Trail day',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              media: [{ type: 'image', url: 'https://example.com/feed.jpg', width: 1200, height: 1500 }],
              likesCount: 3,
              commentsCount: 1,
              visibility: 'public',
            },
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/users') {
        return [
          {
            id: '11111111-1111-4111-8111-111111111111',
            username: 'dusty',
            displayName: 'Dusty Rider',
          },
        ];
      }

      if (path === '/trails') {
        return [
          {
            id: '22222222-2222-4222-8222-222222222222',
            ownerId: '11111111-1111-4111-8111-111111111111',
            title: 'Dusty Loop',
            slug: 'dusty-loop',
            description: null,
            coverImageUrl: null,
            distanceMeters: 10200,
            durationSeconds: 5400,
            elevationGainMeters: 320,
            routePath: [],
            startPoint: { latitude: 1, longitude: 1 },
            endPoint: { latitude: 2, longitude: 2 },
            regionLabel: null,
            visibility: 'public',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      return [];
    });
    await expect(getFeedPosts({ viewerId })).resolves.toEqual({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: '99999999-9999-4999-8999-999999999999',
          userName: 'Dusty Rider',
          handle: '@dusty',
        }),
      ]),
      nextCursor: null,
      hasMore: false,
    });
  });

  it('throws when feed request fails', async () => {
    apiGetMock.mockRejectedValue(new Error('offline'));
    await expect(getFeedPosts({ viewerId })).rejects.toThrow('offline');
  });

  it('returns enriched feed items directly when feed endpoint already includes author and trail', async () => {
    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/feed?viewerId=viewer-1&limit=10') {
        return {
          items: [
            {
              id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
              caption: 'Direct feed item',
              createdAt: new Date().toISOString(),
              media: [{ type: 'image', url: 'https://example.com/direct.jpg', width: 1200, height: 1500 }],
              likesCount: 5,
              commentsCount: 2,
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
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/users') {
        return [];
      }

      if (path === '/trails') {
        return [];
      }

      return [];
    });

    await expect(getFeedPosts({ viewerId })).resolves.toEqual({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          userName: 'Dusty Rider',
          handle: '@dusty',
          trailName: 'DUSTY LOOP',
        }),
      ]),
      nextCursor: null,
      hasMore: false,
    });
  });

  it('prefixes relative media urls from the api with the configured public storage base', async () => {
    process.env.EXPO_PUBLIC_S3_PUBLIC_BASE_URL = 'http://10.0.2.2:9000';

    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/feed?viewerId=viewer-1&limit=10') {
        return {
          items: [
            {
              id: 'fca1470b-f3e0-428d-b31b-a22293f1ec04',
              caption: 'Storage-backed image',
              createdAt: new Date().toISOString(),
              media: [
                {
                  id: '0a338e50-2807-420c-a932-4e0e2719026f',
                  url: '/media/posts/fca1470b-f3e0-428d-b31b-a22293f1ec04/0a338e50-2807-420c-a932-4e0e2719026f.jpeg',
                  type: 'image',
                  width: 594,
                  height: 432,
                  blurhash: null,
                },
              ],
              likesCount: 1,
              commentsCount: 0,
              isLiked: false,
              author: {
                id: '11111111-1111-4111-8111-111111111111',
                username: 'dusty',
                displayName: 'Dusty Rider',
              },
              trail: null,
            },
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/users') {
        return [];
      }

      if (path === '/trails') {
        return [];
      }

      return [];
    });

    await expect(getFeedPosts({ viewerId })).resolves.toEqual({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: 'fca1470b-f3e0-428d-b31b-a22293f1ec04',
          imageUrl:
            'http://10.0.2.2:9000/media/posts/fca1470b-f3e0-428d-b31b-a22293f1ec04/0a338e50-2807-420c-a932-4e0e2719026f.jpeg',
        }),
      ]),
      nextCursor: null,
      hasMore: false,
    });
  });

  it('uses uploaded photos when the feed item exposes photos separately from media', async () => {
    process.env.EXPO_PUBLIC_S3_PUBLIC_BASE_URL = 'http://10.0.2.2:9000';

    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/feed?viewerId=viewer-1&limit=10') {
        return {
          items: [
            {
              id: 'fca1470b-f3e0-428d-b31b-a22293f1ec04',
              caption: 'Photo-backed post',
              createdAt: new Date().toISOString(),
              media: [],
              photos: [
                {
                  id: '0a338e50-2807-420c-a932-4e0e2719026f',
                  url: '/media/posts/fca1470b-f3e0-428d-b31b-a22293f1ec04/0a338e50-2807-420c-a932-4e0e2719026f.jpeg',
                  type: 'image',
                  width: 594,
                  height: 432,
                  blurhash: null,
                },
              ],
              likesCount: 1,
              commentsCount: 0,
              isLiked: false,
              author: {
                id: '11111111-1111-4111-8111-111111111111',
                username: 'dusty',
                displayName: 'Dusty Rider',
              },
              trail: null,
            },
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/users') {
        return [];
      }

      if (path === '/trails') {
        return [];
      }

      return [];
    });

    await expect(getFeedPosts({ viewerId })).resolves.toEqual({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: 'fca1470b-f3e0-428d-b31b-a22293f1ec04',
          imageUrl:
            'http://10.0.2.2:9000/media/posts/fca1470b-f3e0-428d-b31b-a22293f1ec04/0a338e50-2807-420c-a932-4e0e2719026f.jpeg',
        }),
      ]),
      nextCursor: null,
      hasMore: false,
    });
  });

  it('falls back to the post photos endpoint when feed items do not inline media', async () => {
    process.env.EXPO_PUBLIC_S3_PUBLIC_BASE_URL = 'http://10.0.2.2:9000';

    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/feed?viewerId=viewer-1&limit=10') {
        return {
          items: [
            {
              id: '26cceed3-9219-4818-b09f-7fa61974a24e',
              caption: 'Needs photo hydration',
              createdAt: new Date().toISOString(),
              media: [],
              likesCount: 1,
              commentsCount: 0,
              isLiked: false,
              author: {
                id: '11111111-1111-4111-8111-111111111111',
                username: 'dusty',
                displayName: 'Dusty Rider',
              },
              trail: null,
            },
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/posts/26cceed3-9219-4818-b09f-7fa61974a24e/photos') {
        return [
          {
            id: '14932e6c-501c-4ad6-ad56-dfaa99461131',
            url: '/media/posts/26cceed3-9219-4818-b09f-7fa61974a24e/14932e6c-501c-4ad6-ad56-dfaa99461131.jpeg',
            type: 'image',
            width: 594,
            height: 432,
            blurhash: null,
          },
        ];
      }

      if (path === '/users') {
        return [];
      }

      if (path === '/trails') {
        return [];
      }

      return [];
    });

    await expect(getFeedPosts({ viewerId })).resolves.toEqual({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: '26cceed3-9219-4818-b09f-7fa61974a24e',
          imageUrl:
            'http://10.0.2.2:9000/media/posts/26cceed3-9219-4818-b09f-7fa61974a24e/14932e6c-501c-4ad6-ad56-dfaa99461131.jpeg',
        }),
      ]),
      nextCursor: null,
      hasMore: false,
    });
  });

  it('returns story feed data when request succeeds', async () => {
    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/stories?viewerId=viewer-1&limit=20') {
        return {
          items: [
            {
              id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
              authorId: '11111111-1111-4111-8111-111111111111',
              createdAt: new Date().toISOString(),
              expiresAt: new Date().toISOString(),
            },
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/users') {
        return [
          {
            id: '11111111-1111-4111-8111-111111111111',
            displayName: 'Dusty Rider',
          },
        ];
      }

      return [];
    });

    await expect(getHomeStories({ viewerId })).resolves.toEqual({
      items: [
        {
          id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          label: 'Dusty Rider',
          color: expect.any(String),
        },
      ],
      nextCursor: null,
      hasMore: false,
    });
  });

  it('throws when story request fails', async () => {
    apiGetMock.mockRejectedValue(new Error('offline'));
    await expect(getHomeStories({ viewerId })).rejects.toThrow('offline');
  });

  it('runs the feed query hook successfully', async () => {
    apiGetMock.mockImplementation(async (path: string) => {
      if (path === '/feed?viewerId=viewer-1&limit=10') {
        return {
          items: [
            {
              id: '99999999-9999-4999-8999-999999999999',
              authorId: '11111111-1111-4111-8111-111111111111',
              trailId: '22222222-2222-4222-8222-222222222222',
              caption: 'Trail day',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              media: [{ type: 'image', url: 'https://example.com/feed.jpg', width: 1200, height: 1500 }],
              likesCount: 3,
              commentsCount: 1,
              visibility: 'public',
            },
          ],
          nextCursor: null,
          hasMore: false,
        };
      }

      if (path === '/users') {
        return [
          {
            id: '11111111-1111-4111-8111-111111111111',
            username: 'dusty',
            displayName: 'Dusty Rider',
          },
        ];
      }

      if (path === '/trails') {
        return [
          {
            id: '22222222-2222-4222-8222-222222222222',
            ownerId: '11111111-1111-4111-8111-111111111111',
            title: 'Trail',
            slug: 'trail',
            description: null,
            coverImageUrl: null,
            distanceMeters: 1000,
            durationSeconds: 900,
            elevationGainMeters: 50,
            routePath: [],
            startPoint: { latitude: 1, longitude: 1 },
            endPoint: { latitude: 2, longitude: 2 },
            regionLabel: null,
            visibility: 'public',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      return [];
    });
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
