import { type FeedPost } from '@/features/home/model/feed-post.types';
import { mapApiFeedPostToFeedPost } from '@/features/posts/model/post.mappers';
import { type ApiFeedPost } from '@/features/posts/model/post.types';
import { apiGet } from '@/shared/lib/api/api-client';

const feedPosts: FeedPost[] = [
  {
    id: '99999999-9999-4999-8999-999999999999',
    userName: 'Jake "Dusty" Miller',
    handle: '@jake.dusty',
    postedAt: '2h ago',
    trailName: "HELL'S REVENGE LOOP",
    distance: '12.4 mi',
    duration: '4h 05m',
    elevation: '1,940 ft',
    likes: 42,
    comments: 12,
    caption:
      'Absolute carnage today on the slickrock. Traction was perfect, elbows out all day. #Moab #TrailRide',
    imageUrl:
      'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=1200&q=80',
    avatarColor: '#C4B5FD',
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    userName: 'Sarah Moto',
    handle: '@sarahmoto',
    postedAt: '5h ago',
    trailName: 'SILVER KING RUN',
    distance: '28.1 mi',
    duration: '3h 12m',
    elevation: '4,120 ft',
    likes: 128,
    comments: 34,
    caption:
      'Epic climbs, cold river crossings, and a perfect pine section to close the loop. This one deserves a save.',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    avatarColor: '#DDD6FE',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    userName: 'Rafa Ventura',
    handle: '@rafa.ventura',
    postedAt: 'Yesterday',
    trailName: 'VIOLET RIDGE PASS',
    distance: '19.7 mi',
    duration: '2h 48m',
    elevation: '2,760 ft',
    likes: 89,
    comments: 21,
    caption:
      'Fast gravel, a little fog, and the kind of horizon that makes you stop the bike just to look around.',
    imageUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    avatarColor: '#E9D5FF',
  },
];

export async function getFeedPosts() {
  try {
    const apiFeedPosts = await apiGet<ApiFeedPost[]>('/feed');
    return apiFeedPosts.map(mapApiFeedPostToFeedPost);
  } catch {
    return feedPosts;
  }
}
