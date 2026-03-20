import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { router } from 'expo-router';
import { fireEvent, render } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { useScrollToTop } from '@react-navigation/native';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { FeedPostCard } from '@/features/home/components/feed-post-card';
import { CurrentLocationMap as CurrentLocationMapNative } from '@/features/home/components/current-location-map.native';
import { MapNoticeCard } from '@/features/home/components/current-location-map.shared';
import { CurrentLocationMap as CurrentLocationMapWeb } from '@/features/home/components/current-location-map.web';
import { type FeedPost } from '@/features/home/model/feed-post.types';
import { HomeScreen } from '@/features/home/screens/home-screen';

jest.mock('@/features/home/queries/use-feed-posts-query', () => ({
  useFeedPostsQuery: jest.fn(() => ({
    data: {
      pages: [
        {
          items: [
            {
              id: '99999999-9999-4999-8999-999999999999',
              userName: 'Jake',
              handle: '@jake',
              postedAt: 'now',
              hasTrail: true,
              trailName: 'Dusty Loop',
              distance: '10 km',
              duration: '1h',
              elevation: '100 m',
              likes: 5,
              comments: 2,
              caption: 'Great ride',
              imageUrl: 'https://example.com/image.jpg',
              avatarColor: '#fff',
            },
          ],
          nextCursor: null,
          hasMore: false,
        },
      ],
    },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isRefetching: false,
    refetch: jest.fn(),
  })),
}));

jest.mock('@/features/home/queries/use-home-stories-query', () => ({
  useHomeStoriesQuery: jest.fn(() => ({
    data: [
      { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', label: 'You', color: '#FF8A33' },
      { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', label: 'Jake', color: '#FFAA6A' },
    ],
    isRefetching: false,
    refetch: jest.fn(),
  })),
}));

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useScrollToTop: jest.fn(),
}));

const samplePost: FeedPost = {
  id: '99999999-9999-4999-8999-999999999999',
  userName: 'Jake',
  handle: '@jake',
  postedAt: '2h ago',
  hasTrail: true,
  trailName: 'Dusty Loop',
  distance: '12 mi',
  duration: '4h',
  elevation: '2000 ft',
  likes: 42,
  comments: 12,
  caption: 'Great ride',
  imageUrl: 'https://example.com/image.jpg',
  avatarColor: '#ffffff',
};

const mockedRouter = router as unknown as {
  push: jest.Mock;
};
const mockedUseAuthSession = useAuthSession as jest.Mock;
const mockedUseScrollToTop = useScrollToTop as jest.Mock;
const mockedSignOut = jest.fn();

describe('home components and screen', () => {
  beforeEach(() => {
    mockedUseAuthSession.mockReturnValue({
      session: {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'alex@trailblazer.app',
          username: 'alex',
          displayName: 'Alex',
        },
      },
      signOut: mockedSignOut,
    });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockImplementation(
      () => new Promise(() => undefined)
    );
    mockedRouter.push.mockReset();
    mockedSignOut.mockReset();
    mockedUseScrollToTop.mockReset();
  });

  it('renders feed post card content', () => {
    const { getAllByText, getByText } = render(<FeedPostCard post={samplePost} />);
    expect(getAllByText('Jake').length).toBeGreaterThan(0);
    expect(getByText('Dusty Loop')).toBeTruthy();
    expect(getByText('Route')).toBeTruthy();
  });

  it('hides trail content when a post has no linked trail', () => {
    const { getByText, queryByText } = render(
      <FeedPostCard
        post={{
          ...samplePost,
          hasTrail: false,
          trailName: 'OPEN TRAIL',
          distance: 'No trail',
          duration: 'Add route',
          elevation: '0 m',
        }}
      />
    );

    expect(getByText('Great ride')).toBeTruthy();
    expect(queryByText('OPEN TRAIL')).toBeNull();
    expect(queryByText('Route')).toBeNull();
    expect(queryByText('DISTANCE')).toBeNull();
  });

  it('renders shared map notice card', () => {
    const { getByText } = render(
      <MapNoticeCard title="Hello" description="World" actionLabel="Retry" onPress={() => undefined} />
    );
    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('World')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('renders web current location fallback', () => {
    const { getByText } = render(<CurrentLocationMapWeb />);
    expect(getByText(/native-only for now/i)).toBeTruthy();
  });

  it('renders native current location missing-token fallback', () => {
    const { getByText } = render(<CurrentLocationMapNative />);
    expect(getByText(/Add your Mapbox token/i)).toBeTruthy();
  });

  it('renders home screen feed and opens create modal then hides composer', () => {
    const { getByTestId, getByText, queryByText } = render(<HomeScreen />);

    expect(getByText('Trailgram')).toBeTruthy();
    expect(getByText('Trail feed')).toBeTruthy();
    expect(getByText("Share today's trail")).toBeTruthy();
    expect(getByText('You')).toBeTruthy();

    fireEvent.press(getByTestId('close-home-composer'));
    expect(queryByText("Share today's trail")).toBeNull();

    fireEvent.press(getByTestId('open-create-menu'));
    expect(getByText('Choose what you want to publish in Trailgram.')).toBeTruthy();
    fireEvent.press(getByText('New post'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/new-post');
  });

  it('opens hamburger menu actions and can sign out', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    fireEvent.press(getByTestId('open-main-menu'));
    expect(getByText('Disconnect')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();

    fireEvent.press(getByText('Disconnect'));
    expect(mockedSignOut).toHaveBeenCalled();
  });
});
