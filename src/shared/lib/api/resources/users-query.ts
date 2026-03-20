import { queryClient } from '@/shared/lib/react-query/query-client';
import { usersApi } from '@/shared/lib/api/resources/users-api';

export const usersListQueryKey = ['users', 'list'] as const;

export function fetchUsers<T = unknown>() {
  return queryClient.fetchQuery({
    queryKey: usersListQueryKey,
    queryFn: () => usersApi.list<T>(),
  });
}
