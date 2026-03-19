import { mockTrails } from '@/features/posts/constants/mock-trails';
import { getFavoriteTrailIds } from '@/features/posts/lib/trail-favorites-storage';
import { localMockUser } from '@/features/posts/constants/mock-user';
import { getCachedSession } from '@/features/auth/lib/auth-session';
import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { mapTrailToSummary, type Trail } from '@/shared/lib/api/resources';
import { type UserSummary } from '@/features/posts/model/post.types';

export async function getPostComposerData() {
  const sessionUser = getCachedSession()?.user;
  const trails = await trailsApi
    .list<Trail>()
    .then((items) => items.map(mapTrailToSummary))
    .catch(() => []);
  const composerUser: UserSummary = sessionUser
    ? {
        id: sessionUser.id,
        username: sessionUser.username,
        displayName: sessionUser.displayName,
        avatarUrl: sessionUser.avatarUrl ?? null,
      }
    : localMockUser;
  const allTrails = trails.length > 0 ? trails : mockTrails;
  const favoriteTrailIds = await getFavoriteTrailIds(composerUser.id);

  return {
    users: [composerUser],
    trails: allTrails,
    favoriteTrailIds,
  };
}
