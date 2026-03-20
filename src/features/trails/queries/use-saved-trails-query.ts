import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { getSavedTrails } from '@/features/trails/api/get-saved-trails';

export function useSavedTrailsQuery() {
  const { session } = useAuthSession();

  return useInfiniteQuery({
    queryKey: ['trails', 'saved', session?.user.id],
    enabled: Boolean(session?.user.id),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getSavedTrails({ cursor: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}
