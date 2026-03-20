import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { type TrailSummary } from '@/features/posts/model/post.types';
import { socialApi } from '@/shared/lib/api/resources/social-api';
import { type CursorPage } from '@/shared/lib/api/resources';

type ComposerQueryData = {
  users: unknown[];
  trails: TrailSummary[];
  favoriteTrailIds: string[];
};

type TrailDetailQueryData = {
  trail: TrailSummary;
  isSaved: boolean;
};

type ToggleTrailSaveInput = {
  trail: TrailSummary;
  isSaved: boolean;
};

export function useToggleTrailSaveMutation() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async ({ trail, isSaved }: ToggleTrailSaveInput) => {
      if (!userId) {
        throw new Error('A signed-in user is required to save a trail.');
      }

      if (isSaved) {
        await socialApi.unsaveTrail(trail.id, userId);
        return { trail, isSaved: false };
      }

      await socialApi.saveTrail(trail.id, userId);
      return { trail, isSaved: true };
    },
    onMutate: async ({ trail, isSaved }) => {
      const nextIsSaved = !isSaved;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['trails'] }),
        queryClient.cancelQueries({ queryKey: ['posts', 'composer-data'] }),
      ]);

      const previousBrowse = queryClient.getQueryData<InfiniteData<CursorPage<TrailSummary>, string | null>>([
        'trails',
        'browse',
        userId,
      ]);
      const previousSaved = queryClient.getQueryData<InfiniteData<CursorPage<TrailSummary>, string | null>>([
        'trails',
        'saved',
        userId,
      ]);
      const previousSavedIds = queryClient.getQueryData<string[]>(['trails', 'saved-ids', userId]);
      const previousDetail = queryClient.getQueryData<TrailDetailQueryData>(['trails', 'detail', trail.id]);
      const previousComposer = queryClient.getQueryData<ComposerQueryData>(['posts', 'composer-data']);

      queryClient.setQueryData<string[] | undefined>(['trails', 'saved-ids', userId], (current) => {
        if (!current) {
          return current;
        }

        return nextIsSaved
          ? Array.from(new Set([...current, trail.id]))
          : current.filter((savedTrailId) => savedTrailId !== trail.id);
      });

      queryClient.setQueryData<InfiniteData<CursorPage<TrailSummary>, string | null> | undefined>(
        ['trails', 'saved', userId],
        (current) => {
          if (!current) {
            return current;
          }

          const existingItems = current.pages.flatMap((page) => page.items);

          if (nextIsSaved) {
            const nextItems = [trail, ...existingItems.filter((savedTrail) => savedTrail.id !== trail.id)];

            return {
              ...current,
              pages: current.pages.map((page, index) =>
                index === 0
                  ? {
                      ...page,
                      items: nextItems.slice(0, page.items.length + 1),
                    }
                  : page
              ),
            };
          }

          const filteredItems = existingItems.filter((savedTrail) => savedTrail.id !== trail.id);
          let offset = 0;

          return {
            ...current,
            pages: current.pages.map((page) => {
              const nextPageItems = filteredItems.slice(offset, offset + page.items.length);
              offset += page.items.length;

              return {
                ...page,
                items: nextPageItems,
              };
            }),
          };
        }
      );

      queryClient.setQueryData<TrailDetailQueryData | undefined>(['trails', 'detail', trail.id], (current) =>
        current
          ? {
              ...current,
              isSaved: nextIsSaved,
            }
          : current
      );

      queryClient.setQueryData<ComposerQueryData | undefined>(['posts', 'composer-data'], (current) => {
        if (!current) {
          return current;
        }

        const favoriteTrailIds = nextIsSaved
          ? Array.from(new Set([...current.favoriteTrailIds, trail.id]))
          : current.favoriteTrailIds.filter((savedTrailId) => savedTrailId !== trail.id);

        return {
          ...current,
          favoriteTrailIds,
        };
      });

      return {
        previousBrowse,
        previousSaved,
        previousSavedIds,
        previousDetail,
        previousComposer,
      };
    },
    onError: (_error, variables, context) => {
      queryClient.setQueryData(['trails', 'browse', userId], context?.previousBrowse);
      queryClient.setQueryData(['trails', 'saved', userId], context?.previousSaved);
      queryClient.setQueryData(['trails', 'saved-ids', userId], context?.previousSavedIds);
      queryClient.setQueryData(['trails', 'detail', variables.trail.id], context?.previousDetail);
      queryClient.setQueryData(['posts', 'composer-data'], context?.previousComposer);
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['trails', 'browse'] }),
        queryClient.invalidateQueries({ queryKey: ['trails', 'saved'] }),
        queryClient.invalidateQueries({ queryKey: ['trails', 'saved-ids'] }),
        queryClient.invalidateQueries({ queryKey: ['trails', 'detail', variables.trail.id] }),
        queryClient.invalidateQueries({ queryKey: ['posts', 'composer-data'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
      ]);
    },
  });
}
