import { type FeedPost } from '@/features/home/model/feed-post.types';
import {
  type ApiFeedPost,
  type ApiPost,
  type TrailSummary,
  type UserSummary,
} from '@/features/posts/model/post.types';

const avatarPalette = ['#C4B5FD', '#DDD6FE', '#E9D5FF', '#A78BFA', '#D8B4FE'];
const fallbackImage =
  'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=1200&q=80';

function pickAvatarColor(seed: string) {
  const hash = Array.from(seed).reduce((accumulator, character) => {
    return accumulator + character.charCodeAt(0);
  }, 0);

  return avatarPalette[hash % avatarPalette.length] ?? avatarPalette[0];
}

function formatDistance(distanceMeters: number) {
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function formatDuration(durationSeconds: number) {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${Math.max(minutes, 1)}m`;
}

function formatElevation(elevationGainMeters: number) {
  return `${Math.round(elevationGainMeters)} m`;
}

function formatPostedAt(isoDate: string) {
  const now = new Date();
  const posted = new Date(isoDate);
  const differenceMs = now.getTime() - posted.getTime();

  if (!Number.isFinite(differenceMs) || differenceMs < 0) {
    return 'Just now';
  }

  const minutes = Math.floor(differenceMs / 60000);
  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return posted.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function mapTrailSummary(trail?: TrailSummary | null) {
  return {
    trailName: trail?.title?.toUpperCase() ?? 'OPEN TRAIL',
    distance: trail ? formatDistance(trail.distanceMeters) : 'No trail',
    duration: trail ? formatDuration(trail.durationSeconds) : 'Add route',
    elevation: trail ? formatElevation(trail.elevationGainMeters) : '0 m',
  };
}

export function mapApiFeedPostToFeedPost(post: ApiFeedPost): FeedPost {
  const trail = mapTrailSummary(post.trail);

  return {
    id: post.id,
    userName: post.author.displayName,
    handle: `@${post.author.username}`,
    postedAt: formatPostedAt(post.createdAt),
    trailName: trail.trailName,
    distance: trail.distance,
    duration: trail.duration,
    elevation: trail.elevation,
    likes: post.likesCount,
    comments: post.commentsCount,
    caption: post.caption?.trim() || 'New trail post.',
    imageUrl: post.media[0]?.url ?? fallbackImage,
    avatarColor: pickAvatarColor(post.author.id),
  };
}

export function mapCreatedPostToFeedPost(
  post: ApiPost,
  options: {
    author: UserSummary;
    trail?: TrailSummary | null;
  }
): FeedPost {
  return mapApiFeedPostToFeedPost({
    id: post.id,
    caption: post.caption,
    createdAt: post.createdAt,
    media: post.media,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: false,
    author: options.author,
    trail: options.trail ?? null,
  });
}
