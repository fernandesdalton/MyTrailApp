import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeedPosts } from '@/features/home/api/get-feed-posts';

export function useFeedPostsQuery(viewerId?: string) {
  return useInfiniteQuery({
    queryKey: ['home', 'feed-posts', viewerId],
    enabled: Boolean(viewerId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getFeedPosts({
        viewerId: viewerId!,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}
