import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { router } from 'expo-router';
import { fireEvent, render } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { FeedPostCard } from '@/features/home/components/feed-post-card';
import { CurrentLocationMap as CurrentLocationMapNative } from '@/features/home/components/current-location-map.native';
import { MapNoticeCard } from '@/features/home/components/current-location-map.shared';
import { CurrentLocationMap as CurrentLocationMapWeb } from '@/features/home/components/current-location-map.web';
import { type FeedPost } from '@/features/home/model/feed-post.types';
import { HomeScreen } from '@/features/home/screens/home-screen';

jest.mock('@/features/home/queries/use-feed-posts-query', () => ({
  useFeedPostsQuery: jest.fn(() => ({
    data: [
      {
        id: '99999999-9999-4999-8999-999999999999',
        userName: 'Jake',
        handle: '@jake',
        postedAt: 'now',
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
  })),
}));

const samplePost: FeedPost = {
  id: '99999999-9999-4999-8999-999999999999',
  userName: 'Jake',
  handle: '@jake',
  postedAt: '2h ago',
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

describe('home components and screen', () => {
  beforeEach(() => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockImplementation(
      () => new Promise(() => undefined)
    );
    mockedRouter.push.mockReset();
  });

  it('renders feed post card content', () => {
    const { getAllByText, getByText } = render(<FeedPostCard post={samplePost} />);
    expect(getAllByText('Jake').length).toBeGreaterThan(0);
    expect(getByText('Dusty Loop')).toBeTruthy();
    expect(getByText('Route')).toBeTruthy();
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
    const { getAllByText, getByText, queryByText } = render(<HomeScreen />);

    expect(getByText('TrailBlazer')).toBeTruthy();
    expect(getByText('Trail feed')).toBeTruthy();
    expect(getByText("Share today's trail")).toBeTruthy();

    fireEvent.press(getAllByText('x')[0]!);
    expect(queryByText("Share today's trail")).toBeNull();

    fireEvent.press(getByText('+'));
    expect(getByText('Choose what you want to publish in TrailBlazer.')).toBeTruthy();
    fireEvent.press(getByText('New post'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/new-post');
  });
});
