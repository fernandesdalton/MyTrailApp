import { describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { TrailsScreen } from '@/features/trails/screens/trails-screen';
import { usePostComposerDataQuery } from '@/features/posts/queries/use-post-composer-data-query';

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(),
}));

jest.mock('@/features/posts/queries/use-post-composer-data-query', () => ({
  usePostComposerDataQuery: jest.fn(),
}));

const mockedUseAuthSession = useAuthSession as jest.Mock;
const mockedUsePostComposerDataQuery = usePostComposerDataQuery as jest.Mock;

describe('trails screen', () => {
  it('renders all nearby trails in range', () => {
    mockedUseAuthSession.mockReturnValue({
      session: {
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'alex@trailblazer.app',
          username: 'alex',
          displayName: 'Alex',
        },
      },
    });

    mockedUsePostComposerDataQuery.mockReturnValue({
      data: {
        trails: [
          {
            id: '33333333-3333-4333-8333-333333333333',
            title: 'Silver King Run',
            distanceMeters: 12400,
            durationSeconds: 8100,
            elevationGainMeters: 420,
            regionLabel: 'Bend, OR',
            userDistanceKm: 4.2,
            gradeLabel: 'HARD',
            estimatedTimeLabel: '3.5 HR',
            coverImageUrl: 'https://example.com/silver-king.jpg',
            isLiked: true,
          },
          {
            id: '44444444-4444-4444-8444-444444444444',
            title: 'Devil Pass',
            distanceMeters: 21000,
            durationSeconds: 12400,
            elevationGainMeters: 920,
            regionLabel: 'Moab, UT',
            userDistanceKm: 7.3,
            gradeLabel: 'ELITE',
            estimatedTimeLabel: '5.8 HR',
            coverImageUrl: 'https://example.com/devil-pass.jpg',
            isLiked: false,
          },
        ],
        favoriteTrailIds: ['33333333-3333-4333-8333-333333333333'],
      },
      isLoading: false,
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
        <TrailsScreen />
      </QueryClientProvider>
    );

    expect(getByText('Trails nearby')).toBeTruthy();
    expect(getByText('2 RESULTS')).toBeTruthy();
    expect(getByText('SILVER KING RUN')).toBeTruthy();
    expect(getByText('DEVIL PASS')).toBeTruthy();
    queryClient.clear();
  });
});
