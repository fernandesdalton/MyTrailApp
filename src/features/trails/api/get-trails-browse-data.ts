import { mapTrailToSummary, type CursorPage, type Trail } from '@/shared/lib/api/resources';
import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { trailsPageSize } from '@/shared/lib/api/resources/trail-pages';

type GetTrailsBrowseDataParams = {
  cursor?: string | null;
};

export async function getTrailsBrowseData({ cursor }: GetTrailsBrowseDataParams = {}) {
  const page = await trailsApi.list<CursorPage<Trail>>({
    limit: trailsPageSize,
    cursor,
  });

  return {
    items: page.items.map(mapTrailToSummary),
    nextCursor: page.nextCursor,
    hasMore: page.hasMore,
  };
}
