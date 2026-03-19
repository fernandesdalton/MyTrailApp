import { getCachedSession } from '@/features/auth/lib/auth-session';
import { type ApiPost } from '@/features/posts/model/post.types';
import {
  mapPostsToProfileGrid,
  type ProfileData,
  type ProfileUser,
} from '@/features/profile/model/profile.types';
import { mapTrailToSummary, type Trail } from '@/shared/lib/api/resources';
import { usersApi } from '@/shared/lib/api/resources/users-api';

type ApiUser = {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  locationLabel?: string | null;
};

function mapApiUserToProfileUser(user: ApiUser): ProfileUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
    locationLabel: user.locationLabel ?? null,
  };
}

export async function getProfileData(profileUserId?: string): Promise<ProfileData> {
  const sessionUser = getCachedSession()?.user;

  if (!sessionUser) {
    throw new Error('No signed-in user is available for the profile screen.');
  }

  const targetUserId = profileUserId ?? sessionUser.id;

  const [users, profileUser, posts, relatedTrails] = await Promise.all([
    usersApi.list<ApiUser>().catch(() => []),
    usersApi.getById<ApiUser>(targetUserId).catch(() => null),
    usersApi.listPosts<ApiPost>(targetUserId).catch(() => []),
    usersApi.listTrails<Trail>(targetUserId).then((items) => items.map(mapTrailToSummary)).catch(() => []),
  ]);

  const selectedUser =
    profileUser ?? users.find((user) => user.id === targetUserId) ?? null;

  const resolvedProfileUser = selectedUser
    ? mapApiUserToProfileUser(selectedUser)
    : {
        id: targetUserId,
        username: targetUserId === sessionUser.id ? sessionUser.username : 'trailblazer',
        displayName: targetUserId === sessionUser.id ? sessionUser.displayName : 'Trail Rider',
        avatarUrl: targetUserId === sessionUser.id ? sessionUser.avatarUrl ?? null : null,
        bio: 'Enduro and trail riding enthusiast.',
        locationLabel: null,
      };

  const suggestedUsers = users
    .filter((user) => user.id !== targetUserId)
    .map(mapApiUserToProfileUser)
    .slice(0, 6);

  const favoriteTrails = relatedTrails;

  return {
    profileUser: resolvedProfileUser,
    viewerUserId: sessionUser.id,
    isCurrentUser: targetUserId === sessionUser.id,
    postCount: posts.length,
    favoriteTrailCount: favoriteTrails.length,
    connectionCount: Math.max(users.length - 1, 0),
    posts: mapPostsToProfileGrid(posts),
    favoriteTrails,
    suggestedUsers,
  };
}
