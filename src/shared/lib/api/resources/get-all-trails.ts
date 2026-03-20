import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { mapTrailToSummary, type Trail } from '@/shared/lib/api/resources/trails.types';
import { type TrailSummary } from '@/features/posts/model/post.types';

let allTrailsPromise: Promise<TrailSummary[]> | null = null;

export function getAllTrails() {
  if (!allTrailsPromise) {
    allTrailsPromise = trailsApi.list<Trail>().then((items) => items.map(mapTrailToSummary));
  }

  return allTrailsPromise;
}

export function resetAllTrailsCache() {
  allTrailsPromise = null;
}
