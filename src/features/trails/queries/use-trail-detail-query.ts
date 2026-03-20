import { useQuery } from '@tanstack/react-query';

import { getTrailDetail } from '@/features/trails/api/get-trail-detail';

export function useTrailDetailQuery(trailId: string) {
  return useQuery({
    queryKey: ['trails', 'detail', trailId],
    enabled: Boolean(trailId),
    queryFn: () => getTrailDetail(trailId),
  });
}
