import { mockTrails } from '@/features/posts/constants/mock-trails';
import { localMockUser, mockUserSeed } from '@/features/posts/constants/mock-user';
import { type ApiRequestBody } from '@/shared/lib/api/api-client';
import { trailsApi } from '@/shared/lib/api/resources/trails-api';
import { usersApi } from '@/shared/lib/api/resources/users-api';
import { type TrailSummary, type UserSummary } from '@/features/posts/model/post.types';

async function getOrCreateDemoUser() {
  try {
    const users = await usersApi.list<UserSummary>();
    const existingDemoUser = users.find((user) => user.username === mockUserSeed.username);

    if (existingDemoUser) {
      return existingDemoUser;
    }

    const createdUser = await usersApi.create<UserSummary>(mockUserSeed as ApiRequestBody);
    return createdUser;
  } catch {
    return localMockUser;
  }
}

export async function getPostComposerData() {
  const [demoUser, trails] = await Promise.all([
    getOrCreateDemoUser(),
    trailsApi.list<TrailSummary>().catch(() => []),
  ]);

  return {
    users: [demoUser],
    trails: trails.length > 0 ? trails : mockTrails,
  };
}
