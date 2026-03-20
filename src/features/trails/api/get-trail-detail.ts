import { getCachedSession } from '@/features/auth/lib/auth-session';
import { ApiError } from '@/shared/lib/api/api-client';
import { mapTrailToSummary, type Trail } from '@/shared/lib/api/resources';
import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { usersApi } from '@/shared/lib/api/resources/users-api';

export async function getTrailDetail(trailId: string) {
  const sessionUser = getCachedSession()?.user;

  if (!sessionUser) {
    throw new Error('No signed-in user is available for trail details.');
  }

  const [trail, isSaved] = await Promise.all([
    trailsApi.getById<Trail>(trailId).then(mapTrailToSummary),
    usersApi
      .getSavedTrail(sessionUser.id, trailId)
      .then(() => true)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) {
          return false;
        }

        throw error;
      }),
  ]);

  return {
    trail,
    isSaved,
  };
}
