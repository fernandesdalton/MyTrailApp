import { useQuery } from '@tanstack/react-query';

import { getHomeHighlights } from '@/features/home/api/get-home-highlights';

export function useHomeHighlightsQuery() {
  return useQuery({
    queryKey: ['home', 'highlights'],
    queryFn: getHomeHighlights,
  });
}
