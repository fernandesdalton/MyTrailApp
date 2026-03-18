import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { NewPostScreen } from '@/features/posts/screens/new-post-screen';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { mapApiFeedPostToFeedPost, mapCreatedPostToFeedPost } from '@/features/posts/model/post.mappers';
import { useCreatePostMutation } from '@/features/posts/mutations/use-create-post-mutation';
import { usePostComposerDataQuery } from '@/features/posts/queries/use-post-composer-data-query';

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(),
}));

jest.mock('@/features/posts/queries/use-post-composer-data-query', () => ({
  usePostComposerDataQuery: jest.fn(),
}));

jest.mock('@/features/posts/mutations/use-create-post-mutation', () => ({
  useCreatePostMutation: jest.fn(),
}));

const mockedUsePostComposerDataQuery = usePostComposerDataQuery as jest.Mock;
const mockedUseCreatePostMutation = useCreatePostMutation as jest.Mock;
const mockedUseAuthSession = useAuthSession as jest.Mock;
const mockedRouter = router as unknown as {
  back: jest.Mock;
  replace: jest.Mock;
};

describe('post creation', () => {
  beforeEach(() => {
    mockedUseAuthSession.mockReturnValue({
      session: {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'alex@trailblazer.app',
          username: 'alex',
          displayName: 'Alex',
          avatarUrl: null,
        },
      },
      status: 'authenticated',
    });

    mockedUsePostComposerDataQuery.mockReturnValue({
      data: {
        users: [
          {
            id: '11111111-1111-4111-8111-111111111111',
            username: 'alex',
            displayName: 'Alex',
          },
        ],
        trails: [
          {
            id: '22222222-2222-4222-8222-222222222222',
            title: 'Black Rock Canyon',
            distanceMeters: 9600,
            durationSeconds: 8100,
            elevationGainMeters: 420,
          },
        ],
      },
      isLoading: false,
    });

    mockedUseCreatePostMutation.mockReturnValue({
      isPending: false,
      isSuccess: false,
      mutateAsync: jest.fn().mockResolvedValue({ id: '88888888-8888-4888-8888-888888888888' } as never),
    } as never);

    mockedRouter.back.mockReset();
    mockedRouter.replace.mockReset();
  });

  it('renders the new post screen with composer content', () => {
    const { getByText } = render(<NewPostScreen />);

    expect(getByText('NEW POST')).toBeTruthy();
    expect(getByText('CAPTURE OR UPLOAD')).toBeTruthy();
    expect(getByText('BLACK ROCK CANYON')).toBeTruthy();
    expect(getByText('Using the sample ride photo')).toBeTruthy();
    expect(getByText('A temporary sample image is attached until you pick one from your gallery.')).toBeTruthy();
  });

  it('submits a post and navigates back to home', async () => {
    const mutateAsync = jest.fn().mockResolvedValue({ id: '88888888-8888-4888-8888-888888888888' } as never);
    mockedUseCreatePostMutation.mockReturnValue({
      isPending: false,
      isSuccess: false,
      mutateAsync,
    } as never);

    const { getByPlaceholderText, getByText } = render(<NewPostScreen />);
    fireEvent.changeText(
      getByPlaceholderText('Tell the story of the trail...'),
      'Sunset dust and perfect grip.'
    );
    fireEvent.press(getByText('POST'));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        payload: {
          authorId: '11111111-1111-4111-8111-111111111111',
          trailId: '22222222-2222-4222-8222-222222222222',
          caption: 'Sunset dust and perfect grip.',
          visibility: 'public',
          media: [
            {
              id: '66666666-6666-4666-8666-666666666666',
              type: 'image',
              url: 'https://example.com/post.jpg',
              width: 1080,
              height: 1350,
              blurhash: null,
            },
          ],
        },
        author: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'alex',
          displayName: 'Alex',
        },
        trail: {
          id: '22222222-2222-4222-8222-222222222222',
          title: 'Black Rock Canyon',
          distanceMeters: 9600,
          durationSeconds: 8100,
          elevationGainMeters: 420,
        },
      })
    );
    expect(mockedRouter.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('loads an image from the phone gallery', async () => {
    const { getByText } = render(<NewPostScreen />);

    fireEvent.press(getByText('Gallery'));

    await waitFor(() =>
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled()
    );
    expect(getByText('Picked from your gallery')).toBeTruthy();
    expect(getByText('Your photo is attached and ready for this post.')).toBeTruthy();
  });

  it('maps feed and created post payloads into home cards', () => {
    const feedPost = mapApiFeedPostToFeedPost({
      id: '77777777-7777-4777-8777-777777777777',
      caption: 'Locked in.',
      createdAt: new Date().toISOString(),
      media: [{ type: 'image', url: 'https://example.com/feed.jpg', width: 1200, height: 1500 }],
      likesCount: 7,
      commentsCount: 3,
      isLiked: false,
      author: {
        id: '11111111-1111-4111-8111-111111111111',
        username: 'dusty',
        displayName: 'Dusty Rider',
      },
      trail: {
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Ridge Line',
        distanceMeters: 12400,
        durationSeconds: 5400,
        elevationGainMeters: 610,
      },
    });

    const createdPost = mapCreatedPostToFeedPost(
      {
        id: '88888888-8888-4888-8888-888888888888',
        authorId: '11111111-1111-4111-8111-111111111111',
        trailId: '22222222-2222-4222-8222-222222222222',
        caption: 'Fresh line.',
        media: [{ type: 'image', url: 'https://example.com/created.jpg', width: 1200, height: 1500 }],
        visibility: 'public',
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        author: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'dusty',
          displayName: 'Dusty Rider',
        },
        trail: {
          id: '22222222-2222-4222-8222-222222222222',
          title: 'Black Rock Canyon',
          distanceMeters: 9600,
          durationSeconds: 8100,
          elevationGainMeters: 420,
        },
      }
    );

    expect(feedPost.handle).toBe('@dusty');
    expect(feedPost.trailName).toBe('RIDGE LINE');
    expect(createdPost.imageUrl).toBe('https://example.com/created.jpg');
    expect(createdPost.likes).toBe(0);
  });

  it('renders trail selector options from fallback trail data', () => {
    mockedUsePostComposerDataQuery.mockReturnValue({
      data: {
        users: [
          {
            id: '11111111-1111-4111-8111-111111111111',
            username: 'alex',
            displayName: 'Alex',
          },
        ],
        trails: [
          {
            id: '44444444-4444-4444-8444-444444444444',
            title: 'Red Sand Wash',
            distanceMeters: 12400,
            durationSeconds: 5400,
            elevationGainMeters: 310,
            regionLabel: 'St. George, UT',
          },
          {
            id: '55555555-5555-4555-8555-555555555555',
            title: 'Pine Switchbacks',
            distanceMeters: 21600,
            durationSeconds: 14400,
            elevationGainMeters: 1240,
            regionLabel: 'Bend, OR',
          },
        ],
      },
      isLoading: false,
    });

    const { getAllByText, getByText } = render(<NewPostScreen />);

    expect(getByText('2 READY')).toBeTruthy();
    expect(getByText('Red Sand Wash')).toBeTruthy();
    expect(getByText('Pine Switchbacks')).toBeTruthy();
    expect(getAllByText('St. George, UT').length).toBeGreaterThan(0);
  });
});
