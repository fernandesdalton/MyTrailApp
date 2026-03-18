import { useQuery } from '@tanstack/react-query';

import { getFeedPosts } from '@/features/home/api/get-feed-posts';

export function useFeedPostsQuery() {
  return useQuery({
    queryKey: ['home', 'feed-posts'],
    queryFn: getFeedPosts,
  });
}
