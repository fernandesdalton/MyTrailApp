import { mapApiFeedPostToFeedPost } from '@/features/posts/model/post.mappers';
import { type ApiPost, type TrailSummary, type UserSummary, type MediaAsset } from '@/features/posts/model/post.types';
import { getAllTrails } from '@/shared/lib/api/resources/get-all-trails';
import { postsApi } from '@/shared/lib/api/resources/posts-api';
import { fetchUsers } from '@/shared/lib/api/resources/users-query';

type ApiUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
};

export type PostDetailData = {
  authorId: string;
  post: ReturnType<typeof mapApiFeedPostToFeedPost>;
};

export async function getPostDetail(postId: string): Promise<PostDetailData> {
  const [post, users, trails] = await Promise.all([
    postsApi.getById<ApiPost>(postId),
    fetchUsers<ApiUser>(),
    getAllTrails(),
  ]);

  const author = users.find((user) => user.id === post.authorId);
  if (!author) {
    throw new Error('Post author could not be resolved.');
  }

  const trail = post.trailId ? trails.find((item) => item.id === post.trailId) : null;
  let photos = post.photos ?? [];

  if (!photos.length && !post.media.length) {
    try {
      photos = await postsApi.listPhotos<MediaAsset[]>(post.id);
    } catch {
      photos = [];
    }
  }

  return {
    authorId: post.authorId,
    post: mapApiFeedPostToFeedPost({
      id: post.id,
      caption: post.caption,
      createdAt: post.createdAt,
      media: post.media,
      photos,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      isLiked: false,
      author,
      trail: (trail ?? null) as TrailSummary | null,
    }),
  };
}
