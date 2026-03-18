import { type HomeStory } from '@/features/home/model/story.types';
import { storiesApi } from '@/shared/lib/api/resources/stories-api';

type ApiStoryFeedItem = {
  id: string;
  author: {
    id: string;
    displayName: string;
  };
};

const fallbackStories: HomeStory[] = [
  { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', label: 'You', color: '#FF8A33' },
  { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', label: 'Jake', color: '#FFAA6A' },
  { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', label: 'Sarah', color: '#FFB98A' },
  { id: 'ffffffff-ffff-4fff-8fff-ffffffffffff', label: 'Rafa', color: '#FFD3B5' },
];

const storyPalette = ['#FF8A33', '#FFAA6A', '#FFB98A', '#FFD3B5'];

function pickStoryColor(seed: string) {
  const hash = Array.from(seed).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return storyPalette[hash % storyPalette.length] ?? storyPalette[0];
}

export async function getHomeStories() {
  try {
    const stories = await storiesApi.list<ApiStoryFeedItem>();
    const uniqueStories = new Map<string, HomeStory>();

    for (const story of stories) {
      if (uniqueStories.has(story.author.id)) {
        continue;
      }

      uniqueStories.set(story.author.id, {
        id: story.id,
        label: story.author.displayName,
        color: pickStoryColor(story.author.id),
      });
    }

    return uniqueStories.size > 0 ? Array.from(uniqueStories.values()) : fallbackStories;
  } catch {
    return fallbackStories;
  }
}
