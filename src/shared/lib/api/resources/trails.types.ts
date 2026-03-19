import { type PostVisibility, type TrailSummary } from '@/features/posts/model/post.types';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Trail = {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  distanceMeters: number;
  durationSeconds: number;
  elevationGainMeters: number;
  routePath: Coordinate[];
  startPoint: Coordinate;
  endPoint: Coordinate;
  regionLabel: string | null;
  visibility: PostVisibility;
  createdAt: string;
  updatedAt: string;
};

export type TrailCreatePayload = {
  ownerId: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  distanceMeters: number;
  durationSeconds: number;
  elevationGainMeters: number;
  routePath: Coordinate[];
  startPoint: Coordinate;
  endPoint: Coordinate;
  regionLabel: string | null;
  visibility: PostVisibility;
};

export type TrailUpdatePayload = Partial<TrailCreatePayload>;

export type SavedTrailResponse = {
  userId: string;
  trailId: string;
  createdAt: string;
};

export type UnsaveTrailResponse = {
  status: 'unsaved';
};

export function mapTrailToSummary(trail: Trail): TrailSummary {
  return {
    id: trail.id,
    title: trail.title,
    distanceMeters: trail.distanceMeters,
    durationSeconds: trail.durationSeconds,
    elevationGainMeters: trail.elevationGainMeters,
    regionLabel: trail.regionLabel,
    coverImageUrl: trail.coverImageUrl,
  };
}
