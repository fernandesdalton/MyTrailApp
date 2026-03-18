import { useQuery } from '@tanstack/react-query';

import { getPostComposerData } from '@/features/posts/api/get-post-composer-data';

export function usePostComposerDataQuery() {
  return useQuery({
    queryKey: ['posts', 'composer-data'],
    queryFn: getPostComposerData,
  });
}
