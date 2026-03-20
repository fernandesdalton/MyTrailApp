import { type ApiPost, type TrailSummary, type UserSummary } from '@/features/posts/model/post.types';
import { resolveAssetUrl } from '@/shared/lib/api/asset-url';

export type ProfileUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
  followersCount?: number;
  followingCount?: number;
  connectionsCount?: number;
};

export type ProfilePostGridItem = {
  id: string;
  imageUrl: string;
  caption: string;
};

export type ProfileData = {
  profileUser: ProfileUser;
  viewerUserId: string;
  isCurrentUser: boolean;
  postCount: number;
  favoriteTrailCount: number;
  posts: ProfilePostGridItem[];
  favoriteTrails: TrailSummary[];
  suggestedUsers: ProfileUser[];
};

export function mapPostsToProfileGrid(posts: ApiPost[]): ProfilePostGridItem[] {
  return posts.map((post) => ({
    id: post.id,
    imageUrl:
      resolveAssetUrl(post.photos?.[0]?.url ?? post.media[0]?.url) ??
      'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=1200&q=80',
    caption: post.caption?.trim() || 'Trail post',
  }));
}
