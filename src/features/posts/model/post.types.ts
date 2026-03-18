export type PostVisibility = 'public' | 'followers' | 'private';

export type MediaAsset = {
  id?: string;
  type: 'image' | 'video';
  url: string;
  width: number;
  height: number;
  blurhash?: string | null;
};

export type UserSummary = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
};

export type TrailSummary = {
  id: string;
  title: string;
  distanceMeters: number;
  durationSeconds: number;
  elevationGainMeters: number;
  regionLabel?: string | null;
};

export type ApiFeedPost = {
  id: string;
  caption?: string | null;
  createdAt: string;
  media: MediaAsset[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  author: UserSummary;
  trail?: TrailSummary | null;
};

export type ApiPost = {
  id: string;
  authorId: string;
  trailId?: string | null;
  caption?: string | null;
  media: MediaAsset[];
  visibility: PostVisibility;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PostCreatePayload = {
  authorId: string;
  trailId?: string | null;
  caption?: string | null;
  media: MediaAsset[];
  visibility: PostVisibility;
};
