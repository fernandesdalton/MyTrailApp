import { useQuery } from '@tanstack/react-query';

import { getProfileData } from '@/features/profile/api/get-profile-data';

export function useProfileDataQuery(profileUserId?: string) {
  return useQuery({
    queryKey: ['profile', profileUserId ?? 'current-user'],
    queryFn: () => getProfileData(profileUserId),
  });
}
