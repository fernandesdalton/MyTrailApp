export { commentsApi } from '@/shared/lib/api/resources/comments-api';
export { postsApi } from '@/shared/lib/api/resources/posts-api';
export { socialApi } from '@/shared/lib/api/resources/social-api';
export { storiesApi } from '@/shared/lib/api/resources/stories-api';
export { trailsApi } from '@/shared/lib/api/resources/trails-api';
export type {
  Coordinate,
  SavedTrailResponse,
  Trail,
  TrailCreatePayload,
  TrailUpdatePayload,
  UnsaveTrailResponse,
} from '@/shared/lib/api/resources/trails.types';
export { mapTrailToSummary } from '@/shared/lib/api/resources/trails.types';
export { usersApi } from '@/shared/lib/api/resources/users-api';
