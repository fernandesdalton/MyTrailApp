import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { getTrailsBrowseData } from '@/features/trails/api/get-trails-browse-data';
import { getAllSavedTrailIds } from '@/shared/lib/api/resources/trail-pages';

export function useTrailsBrowseQuery() {
  const { session } = useAuthSession();

  return useInfiniteQuery({
    queryKey: ['trails', 'browse', session?.user.id],
    enabled: Boolean(session?.user.id),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getTrailsBrowseData({ cursor: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

export function useSavedTrailIdsQuery() {
  const { session } = useAuthSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['trails', 'saved-ids', userId],
    enabled: Boolean(userId),
    queryFn: () => getAllSavedTrailIds(userId!),
  });
}
