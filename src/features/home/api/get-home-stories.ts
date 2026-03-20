import { type HomeStory } from '@/features/home/model/story.types';
import { storiesApi } from '@/shared/lib/api/resources/stories-api';
import { usersApi } from '@/shared/lib/api/resources/users-api';
import { type CursorPage } from '@/features/home/api/get-feed-posts';

type ApiStory = {
  id: string;
  authorId: string;
  trailId?: string | null;
  caption?: string | null;
  expiresAt: string;
  createdAt: string;
};

type ApiUser = {
  id: string;
  displayName: string;
};

const storyPalette = ['#FF8A33', '#FFAA6A', '#FFB98A', '#FFD3B5'];

function pickStoryColor(seed: string) {
  const hash = Array.from(seed).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return storyPalette[hash % storyPalette.length] ?? storyPalette[0];
}

type StoryRequestParams = {
  viewerId: string;
  limit?: number;
  cursor?: string | null;
};

const DEFAULT_STORY_PAGE_SIZE = 20;

export async function getHomeStories({
  viewerId,
  limit = DEFAULT_STORY_PAGE_SIZE,
  cursor,
}: StoryRequestParams) {
  const [storiesPage, users] = await Promise.all([
    storiesApi.list<CursorPage<ApiStory>>({ viewerId, limit, cursor }),
    usersApi.list<ApiUser>(),
  ]);

  const usersById = new Map(users.map((user) => [user.id, user]));
  const uniqueStories = new Map<string, HomeStory>();

  for (const story of storiesPage.items) {
    if (uniqueStories.has(story.authorId)) {
      continue;
    }

    const author = usersById.get(story.authorId);
    if (!author) {
      continue;
    }

    uniqueStories.set(story.authorId, {
      id: story.id,
      label: author.displayName,
      color: pickStoryColor(story.authorId),
    });
  }

  return {
    items: Array.from(uniqueStories.values()),
    nextCursor: storiesPage.nextCursor,
    hasMore: storiesPage.hasMore,
  };
}
