import { mapApiFeedPostToFeedPost } from '@/features/posts/model/post.mappers';
import {
  type ApiFeedPost,
  type ApiFeedPostItem,
  type MediaAsset,
  type ApiPost,
  type TrailSummary,
  type UserSummary,
} from '@/features/posts/model/post.types';
import { postsApi } from '@/shared/lib/api/resources/posts-api';
import { getAllTrails } from '@/shared/lib/api/resources/get-all-trails';
import { fetchUsers } from '@/shared/lib/api/resources/users-query';

type ApiUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
};

type FeedRequestParams = {
  viewerId: string;
  limit?: number;
  cursor?: string | null;
};

const DEFAULT_FEED_PAGE_SIZE = 10;

function isJoinedFeedPost(post: ApiFeedPostItem): post is ApiFeedPost {
  return 'author' in post && typeof post.author === 'object' && post.author !== null;
}

function hasRenderableMedia(post: Pick<ApiFeedPost, 'media' | 'photos'>) {
  return Boolean(post.photos?.length || post.media.length);
}

export async function getFeedPosts({ viewerId, limit = DEFAULT_FEED_PAGE_SIZE, cursor }: FeedRequestParams) {
  const [feedPage, users, trails] = await Promise.all([
    postsApi.list<CursorPage<ApiFeedPostItem>>({ viewerId, limit, cursor }),
    fetchUsers<ApiUser>(),
    getAllTrails(),
  ]);

  const usersById = new Map(users.map((user) => [user.id, user]));
  const trailsById = new Map(trails.map((trail) => [trail.id, trail]));

  const joinedPosts = feedPage.items
    .map((post): ApiFeedPost | null => {
      if (isJoinedFeedPost(post)) {
        return {
          ...post,
          media: post.media ?? [],
          trail: post.trail ?? null,
        };
      }

      const author = usersById.get(post.authorId);
      const trail = post.trailId ? trailsById.get(post.trailId) : null;

      if (!author) {
        return null;
      }

      return {
        id: post.id,
        caption: post.caption ?? null,
        createdAt: post.createdAt,
        media: post.media ?? [],
        photos: post.photos ?? [],
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        isLiked: false,
        author,
        trail: (trail ?? null) as TrailSummary | null,
      };
    })
    .filter((post): post is ApiFeedPost => post !== null)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  const postsWithResolvedPhotos = await Promise.all(
    joinedPosts.map(async (post) => {
      if (hasRenderableMedia(post)) {
        return post;
      }

      try {
        const photos = await postsApi.listPhotos<MediaAsset[]>(post.id);
        return {
          ...post,
          photos,
        };
      } catch {
        return post;
      }
    })
  );

  return {
    items: postsWithResolvedPhotos.map(mapApiFeedPostToFeedPost),
    nextCursor: feedPage.nextCursor,
    hasMore: feedPage.hasMore,
  };
}
