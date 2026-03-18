import { useQuery } from '@tanstack/react-query';

import { getHomeStories } from '@/features/home/api/get-home-stories';

export function useHomeStoriesQuery() {
  return useQuery({
    queryKey: ['home', 'stories'],
    queryFn: getHomeStories,
  });
}
