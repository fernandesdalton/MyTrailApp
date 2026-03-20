import { useQuery } from '@tanstack/react-query';

import { getHomeStories } from '@/features/home/api/get-home-stories';

export function useHomeStoriesQuery(viewerId?: string) {
  return useQuery({
    queryKey: ['home', 'stories', viewerId],
    enabled: Boolean(viewerId),
    queryFn: () =>
      getHomeStories({
        viewerId: viewerId!,
      }),
    select: (page) => page.items,
  });
}
