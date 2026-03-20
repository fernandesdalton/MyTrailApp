import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { type CursorPage } from '@/features/home/api/get-feed-posts';
import { type FeedPost } from '@/features/home/model/feed-post.types';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { createPost } from '@/features/posts/api/create-post';
import { type PostPhotoUploadInput, uploadPostPhoto } from '@/features/posts/api/upload-post-photo';
import { mapCreatedPostToFeedPost } from '@/features/posts/model/post.mappers';
import {
  type MediaAsset,
  type PostCreatePayload,
  type TrailSummary,
  type UserSummary,
} from '@/features/posts/model/post.types';
import { postsApi } from '@/shared/lib/api/resources/posts-api';

type CreatePostInput = {
  payload: PostCreatePayload;
  author: UserSummary;
  trail?: TrailSummary | null;
  photoUpload?: PostPhotoUploadInput | null;
};

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Unable to upload the selected photo right now.';
}

function withUploadedPhoto(post: {
  media: MediaAsset[];
  photos?: MediaAsset[];
} & Record<string, unknown>, uploadedPhoto?: MediaAsset | null) {
  if (!uploadedPhoto) {
    return post;
  }

  return {
    ...post,
    media: [uploadedPhoto],
    photos: [uploadedPhoto],
  };
}

export function useCreatePostMutation() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, author, trail, photoUpload }: CreatePostInput) => {
      const createdPost = await createPost(payload);
      let uploadedPhoto: MediaAsset | null = null;

      if (photoUpload) {
        try {
          uploadedPhoto = await uploadPostPhoto(createdPost.id, photoUpload);
        } catch (error) {
          try {
            await postsApi.remove(createdPost.id);
          } catch {
            // Best effort cleanup only. The upload error is still the primary failure.
          }

          throw new Error(toErrorMessage(error));
        }
      }

      return {
        createdPost: withUploadedPhoto(createdPost, uploadedPhoto),
        author,
        trail,
        uploadedPhoto,
      };
    },
    onSuccess: async ({ createdPost, author, trail, uploadedPhoto }) => {
      const feedPost = mapCreatedPostToFeedPost(createdPost, { author, trail });
      const viewerId = session?.user.id;

      if (!viewerId) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['profile'] });

      if (uploadedPhoto) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['home', 'feed-posts', viewerId] }),
          queryClient.invalidateQueries({ queryKey: ['home', 'stories', viewerId] }),
        ]);
        return;
      }

      queryClient.setQueryData<InfiniteData<CursorPage<FeedPost>, string | null>>(
        ['home', 'feed-posts', viewerId],
        (currentPosts) => {
          if (!currentPosts || currentPosts.pages.length === 0) {
            return {
              pageParams: [null],
              pages: [
                {
                  items: [feedPost],
                  nextCursor: null,
                  hasMore: false,
                },
              ],
            };
          }

          return {
            ...currentPosts,
            pages: currentPosts.pages.map((page, index) => {
              if (index !== 0) {
                return page;
              }

              return {
                ...page,
                items: [feedPost, ...page.items],
              };
            }),
          };
        }
      );
    },
  });
}
