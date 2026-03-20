import { getCachedSession } from '@/features/auth/lib/auth-session';
import { type UserSummary } from '@/features/posts/model/post.types';
import { getAllTrails } from '@/shared/lib/api/resources/get-all-trails';
import { mapTrailToSummary, type Trail } from '@/shared/lib/api/resources';
import { usersApi } from '@/shared/lib/api/resources/users-api';

type ApiUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
};

export async function getPostComposerData() {
  const sessionUser = getCachedSession()?.user;

  if (!sessionUser) {
    throw new Error('No signed-in user is available for post creation.');
  }

  const [allTrails, favoriteTrails, backendUser] = await Promise.all([
    getAllTrails(),
    usersApi.listTrails<Trail>(sessionUser.id).then((items) => items.map(mapTrailToSummary)),
    usersApi.getById<ApiUser>(sessionUser.id).catch(() => null),
  ]);

  const composerUser: UserSummary = backendUser
    ? {
        id: backendUser.id,
        username: backendUser.username,
        displayName: backendUser.displayName,
        avatarUrl: backendUser.avatarUrl ?? null,
      }
    : {
        id: sessionUser.id,
        username: sessionUser.username,
        displayName: sessionUser.displayName,
        avatarUrl: sessionUser.avatarUrl ?? null,
      };

  return {
    users: [composerUser],
    trails: allTrails,
    favoriteTrailIds: favoriteTrails.map((trail) => trail.id),
  };
}
