import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { mapTrailToSummary, type CursorPage, type Trail } from '@/shared/lib/api/resources/trails.types';
import { usersApi } from '@/shared/lib/api/resources/users-api';
import { type TrailSummary } from '@/features/posts/model/post.types';

const DEFAULT_TRAILS_PAGE_SIZE = 20;

async function fetchAllTrailPages(fetchPage: (cursor: string | null) => Promise<CursorPage<Trail>>) {
  const items: Trail[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const page = await fetchPage(cursor);
    items.push(...page.items);
    cursor = page.nextCursor;
    hasMore = page.hasMore;
  }

  return items;
}

export async function getAllTrailSummaries() {
  const items = await fetchAllTrailPages((cursor) =>
    trailsApi.list<CursorPage<Trail>>({
      limit: DEFAULT_TRAILS_PAGE_SIZE,
      cursor,
    })
  );

  return items.map(mapTrailToSummary);
}

export async function getAllUserTrailSummaries(userId: string) {
  const items = await fetchAllTrailPages((cursor) =>
    usersApi.listTrails<CursorPage<Trail>>(userId, {
      limit: DEFAULT_TRAILS_PAGE_SIZE,
      cursor,
    })
  );

  return items.map(mapTrailToSummary);
}

export async function getAllSavedTrailSummaries(userId: string) {
  const items = await fetchAllTrailPages((cursor) =>
    usersApi.listSavedTrails<CursorPage<Trail>>(userId, {
      limit: DEFAULT_TRAILS_PAGE_SIZE,
      cursor,
    })
  );

  return items.map(mapTrailToSummary);
}

export async function getAllSavedTrailIds(userId: string) {
  const trails = await getAllSavedTrailSummaries(userId);
  return trails.map((trail) => trail.id);
}

export const trailsPageSize = DEFAULT_TRAILS_PAGE_SIZE;
