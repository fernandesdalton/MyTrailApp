import { mapApiFeedPostToFeedPost } from '@/features/posts/model/post.mappers';
import { type ApiFeedPost, type ApiPost, type TrailSummary, type UserSummary } from '@/features/posts/model/post.types';
import { postsApi } from '@/shared/lib/api/resources/posts-api';
import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { mapTrailToSummary, type Trail } from '@/shared/lib/api/resources/trails.types';
import { usersApi } from '@/shared/lib/api/resources/users-api';

type ApiUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
};

export async function getFeedPosts() {
  const [posts, users, trails] = await Promise.all([
    postsApi.list<ApiPost>(),
    usersApi.list<ApiUser>(),
    trailsApi.list<Trail>().then((items) => items.map(mapTrailToSummary)),
  ]);

  const usersById = new Map(users.map((user) => [user.id, user]));
  const trailsById = new Map(trails.map((trail) => [trail.id, trail]));

  const joinedPosts = posts
    .map((post): ApiFeedPost | null => {
      const author = usersById.get(post.authorId);
      const trail = post.trailId ? trailsById.get(post.trailId) : null;

      if (!author) {
        return null;
      }

      return {
        id: post.id,
        caption: post.caption ?? null,
        createdAt: post.createdAt,
        media: post.media,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        isLiked: false,
        author,
        trail: (trail ?? null) as TrailSummary | null,
      };
    })
    .filter((post): post is ApiFeedPost => post !== null)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return joinedPosts.map(mapApiFeedPostToFeedPost);
}
