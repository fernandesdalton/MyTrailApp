import { describe, expect, it, jest } from '@jest/globals';
import { router } from 'expo-router';
import { fireEvent, render } from '@testing-library/react-native';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { useProfileDataQuery } from '@/features/profile/queries/use-profile-data-query';
import { ProfileScreen } from '@/features/profile/screens/profile-screen';

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(),
}));

jest.mock('@/features/profile/queries/use-profile-data-query', () => ({
  useProfileDataQuery: jest.fn(),
}));

const mockedUseAuthSession = useAuthSession as jest.Mock;
const mockedUseProfileDataQuery = useProfileDataQuery as jest.Mock;
const mockedRouter = router as unknown as {
  push: jest.Mock;
};

describe('profile screen', () => {
  it('renders the signed-in user profile and opens a suggested rider profile', () => {
    mockedUseAuthSession.mockReturnValue({
      session: {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'alex@trailblazer.app',
          username: 'alex_rider_99',
          displayName: 'Alex Rider',
          avatarUrl: null,
        },
      },
    });

    mockedUseProfileDataQuery.mockReturnValue({
      data: {
        profileUser: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'alex_rider_99',
          displayName: 'Alex Rider',
          avatarUrl: null,
          bio: 'Enduro and desert riding enthusiast.',
          locationLabel: 'Moab, UT',
        },
        viewerUserId: '11111111-1111-4111-8111-111111111111',
        isCurrentUser: true,
        postCount: 12,
        favoriteTrailCount: 4,
        connectionCount: 2,
        posts: [
          {
            id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
            imageUrl: 'https://example.com/post-1.jpg',
            caption: 'Ride one',
          },
        ],
        favoriteTrails: [
          {
            id: '44444444-4444-4444-8444-444444444444',
            title: 'Silver King Run',
            distanceMeters: 12400,
            durationSeconds: 8100,
            elevationGainMeters: 420,
            regionLabel: 'Bend, OR',
            coverImageUrl: 'https://example.com/trail-1.jpg',
          },
        ],
        suggestedUsers: [
          {
            id: '22222222-2222-4222-8222-222222222222',
            username: 'dusty_miles',
            displayName: 'Dusty Miles',
            avatarUrl: null,
            bio: 'Enduro lines.',
            locationLabel: 'Moab, UT',
          },
        ],
      },
    });

    const { getByText, queryByText } = render(<ProfileScreen />);

    expect(getByText('alex_rider_99')).toBeTruthy();
    expect(getByText('Alex Rider')).toBeTruthy();
    expect(getByText('Suggested riders')).toBeTruthy();
    expect(getByText('CONNECTIONS')).toBeTruthy();
    expect(queryByText('Message')).toBeNull();

    fireEvent.press(getByText('Connect'));
    expect(getByText('Connected')).toBeTruthy();

    fireEvent.press(getByText('Dusty Miles'));
    expect(mockedRouter.push).toHaveBeenCalledWith({
      pathname: '/profile/[userId]',
      params: { userId: '22222222-2222-4222-8222-222222222222' },
    });
  });

  it('renders another rider profile, follows them, and switches to favorite trails', () => {
    mockedUseAuthSession.mockReturnValue({
      session: {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'alex@trailblazer.app',
          username: 'alex_rider_99',
          displayName: 'Alex Rider',
          avatarUrl: null,
        },
      },
    });

    mockedUseProfileDataQuery.mockReturnValue({
      data: {
        profileUser: {
          id: '33333333-3333-4333-8333-333333333333',
          username: 'dusty_miles',
          displayName: 'Dusty Miles',
          avatarUrl: null,
          bio: 'Mountain dust and switchback hunting.',
          locationLabel: 'Bend, OR',
        },
        viewerUserId: '11111111-1111-4111-8111-111111111111',
        isCurrentUser: false,
        postCount: 8,
        favoriteTrailCount: 3,
        connectionCount: 42,
        posts: [
          {
            id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
            imageUrl: 'https://example.com/post-2.jpg',
            caption: 'Ride two',
          },
        ],
        favoriteTrails: [
          {
            id: '44444444-4444-4444-8444-444444444444',
            title: 'Whispering Pines',
            distanceMeters: 8600,
            durationSeconds: 4320,
            elevationGainMeters: 180,
            regionLabel: 'Bend, OR',
            coverImageUrl: 'https://example.com/trail-2.jpg',
          },
        ],
        suggestedUsers: [],
      },
    });

    const { getByText } = render(<ProfileScreen userId="33333333-3333-4333-8333-333333333333" />);

    expect(getByText('dusty_miles')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
    expect(() => getByText('Message')).not.toThrow();

    fireEvent.press(getByText('Connect'));
    expect(getByText('Connected')).toBeTruthy();

    fireEvent.press(getByText('Favorite Trails'));
    expect(getByText('Whispering Pines')).toBeTruthy();
  });
});
