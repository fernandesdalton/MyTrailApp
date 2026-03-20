import { getCachedSession } from '@/features/auth/lib/auth-session';
import { mapTrailToSummary, type CursorPage, type Trail } from '@/shared/lib/api/resources';
import { trailsPageSize } from '@/shared/lib/api/resources/trail-pages';
import { usersApi } from '@/shared/lib/api/resources/users-api';

type GetSavedTrailsParams = {
  cursor?: string | null;
};

export async function getSavedTrails({ cursor }: GetSavedTrailsParams = {}) {
  const sessionUser = getCachedSession()?.user;

  if (!sessionUser) {
    throw new Error('No signed-in user is available for saved trails.');
  }

  const page = await usersApi.listSavedTrails<CursorPage<Trail>>(sessionUser.id, {
    limit: trailsPageSize,
    cursor,
  });

  return {
    items: page.items.map(mapTrailToSummary),
    nextCursor: page.nextCursor,
    hasMore: page.hasMore,
  };
}
