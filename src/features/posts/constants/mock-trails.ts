import { type TrailSummary } from '@/features/posts/model/post.types';

export const mockTrails: TrailSummary[] = [
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Sunrise Trail',
    distanceMeters: 9600,
    durationSeconds: 8100,
    elevationGainMeters: 420,
    regionLabel: 'Moab, UT',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: 'Silver Ridge Run',
    distanceMeters: 18300,
    durationSeconds: 11700,
    elevationGainMeters: 860,
    regionLabel: 'Ouray, CO',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'Red Sand Wash',
    distanceMeters: 12400,
    durationSeconds: 5400,
    elevationGainMeters: 310,
    regionLabel: 'St. George, UT',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    title: 'Pine Switchbacks',
    distanceMeters: 21600,
    durationSeconds: 14400,
    elevationGainMeters: 1240,
    regionLabel: 'Bend, OR',
  },
];
