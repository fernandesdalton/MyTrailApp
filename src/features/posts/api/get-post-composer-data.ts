import { mockTrails } from '@/features/posts/constants/mock-trails';
import { localMockUser } from '@/features/posts/constants/mock-user';
import { getCachedSession } from '@/features/auth/lib/auth-session';
import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { type TrailSummary, type UserSummary } from '@/features/posts/model/post.types';

export async function getPostComposerData() {
  const sessionUser = getCachedSession()?.user;
  const trails = await trailsApi.list<TrailSummary>().catch(() => []);
  const composerUser: UserSummary = sessionUser
    ? {
        id: sessionUser.id,
        username: sessionUser.username,
        displayName: sessionUser.displayName,
        avatarUrl: sessionUser.avatarUrl ?? null,
      }
    : localMockUser;

  return {
    users: [composerUser],
    trails: trails.length > 0 ? trails : mockTrails,
  };
}
