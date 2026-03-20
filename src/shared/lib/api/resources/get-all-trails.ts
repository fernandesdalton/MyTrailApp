import { getAllTrailSummaries } from '@/shared/lib/api/resources/trail-pages';
import { type TrailSummary } from '@/features/posts/model/post.types';

let allTrailsPromise: Promise<TrailSummary[]> | null = null;

export function getAllTrails() {
  if (!allTrailsPromise) {
    allTrailsPromise = getAllTrailSummaries();
  }

  return allTrailsPromise;
}

export function resetAllTrailsCache() {
  allTrailsPromise = null;
}
