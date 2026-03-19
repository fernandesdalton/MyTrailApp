import { type ApiPost, type TrailSummary, type UserSummary } from '@/features/posts/model/post.types';

export type ProfileUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
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
  connectionCount: number;
  posts: ProfilePostGridItem[];
  favoriteTrails: TrailSummary[];
  suggestedUsers: ProfileUser[];
};

export function mapPostsToProfileGrid(posts: ApiPost[]): ProfilePostGridItem[] {
  return posts.map((post) => ({
    id: post.id,
    imageUrl: post.media[0]?.url ?? 'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=1200&q=80',
    caption: post.caption?.trim() || 'Trail post',
  }));
}
