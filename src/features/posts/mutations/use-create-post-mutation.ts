import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type FeedPost } from '@/features/home/model/feed-post.types';
import { createPost } from '@/features/posts/api/create-post';
import { mapCreatedPostToFeedPost } from '@/features/posts/model/post.mappers';
import {
  type PostCreatePayload,
  type TrailSummary,
  type UserSummary,
} from '@/features/posts/model/post.types';

type CreatePostInput = {
  payload: PostCreatePayload;
  author: UserSummary;
  trail?: TrailSummary | null;
};

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, author, trail }: CreatePostInput) => {
      const createdPost = await createPost(payload);
      return { createdPost, author, trail };
    },
    onSuccess: ({ createdPost, author, trail }) => {
      const feedPost = mapCreatedPostToFeedPost(createdPost, { author, trail });

      queryClient.setQueryData<FeedPost[]>(['home', 'feed-posts'], (currentPosts) => {
        if (!currentPosts) {
          return [feedPost];
        }

        return [feedPost, ...currentPosts];
      });
    },
  });
}
