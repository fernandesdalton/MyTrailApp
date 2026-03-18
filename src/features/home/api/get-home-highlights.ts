import { homeHighlightSchema, type HomeHighlight } from '@/features/home/model/home.types';

const highlights: HomeHighlight[] = [
  {
    id: 'routing',
    title: 'Expo Router as the app shell',
    description: 'Route files stay tiny while features own their screens and logic.',
  },
  {
    id: 'data',
    title: 'React Query for server state',
    description: 'API reads, caching, invalidation, and loading states stay predictable.',
  },
  {
    id: 'state',
    title: 'Zustand for local interaction state',
    description: 'Simple state stays local to the feature instead of growing into a global store.',
  },
];

export async function getHomeHighlights() {
  return homeHighlightSchema.array().parseAsync(highlights);
}
