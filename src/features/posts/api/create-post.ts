import { postsApi } from '@/shared/lib/api/resources/posts-api';
import { type ApiPost, type PostCreatePayload } from '@/features/posts/model/post.types';

export async function createPost(payload: PostCreatePayload) {
  return postsApi.create<ApiPost>(payload);
}
