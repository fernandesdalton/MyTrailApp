import { type UserSummary } from '@/features/posts/model/post.types';

export const mockUserSeed = {
  username: 'trailblazer.demo',
  displayName: 'Dusty Rider',
  bio: 'Demo rider until login is ready.',
  locationLabel: 'Moab, UT',
};

export const localMockUser: UserSummary = {
  id: '11111111-1111-4111-8111-111111111111',
  username: 'alex',
  displayName: 'Alex',
  avatarUrl: null,
};
