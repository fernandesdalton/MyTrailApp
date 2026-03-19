import { type ProfileUser } from '@/features/profile/model/profile.types';

export const mockSuggestedUsers: ProfileUser[] = [
  {
    id: '77777777-7777-4777-8777-777777777777',
    username: 'dusty_miles',
    displayName: 'Dusty Miles',
    avatarUrl: null,
    bio: 'Enduro lines and desert sunrise runs.',
    locationLabel: 'Moab, UT',
  },
  {
    id: '88888888-8888-4888-8888-888888888888',
    username: 'pine.apex',
    displayName: 'Pine Apex',
    avatarUrl: null,
    bio: 'Forest switchbacks and machine photography.',
    locationLabel: 'Bend, OR',
  },
];
