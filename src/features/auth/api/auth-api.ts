import { z } from 'zod';

import { createAuthSession } from '@/features/auth/lib/auth-token';
import { getStoredCredentials, upsertStoredCredential } from '@/features/auth/lib/auth-storage';
import {
  type AuthSession,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '@/features/auth/model/auth.types';
import { usersApi } from '@/shared/lib/api/resources/users-api';

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const registerSchema = z.object({
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters.'),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type BackendUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
};

function slugifyUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20);
}

function buildUniqueUsername(email: string, displayName: string, existingUsernames: string[]) {
  const emailBase = email.split('@')[0] ?? '';
  const preferredBase = slugifyUsername(emailBase) || slugifyUsername(displayName) || 'trailblazer';

  if (!existingUsernames.includes(preferredBase)) {
    return preferredBase;
  }

  let suffix = 2;
  let candidate = `${preferredBase}_${suffix}`;

  while (existingUsernames.includes(candidate)) {
    suffix += 1;
    candidate = `${preferredBase}_${suffix}`;
  }

  return candidate;
}

function toAuthUser(user: BackendUser, email: string): AuthUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? null,
    email,
  };
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthSession> {
    const parsed = registerSchema.parse(payload);
    const storedCredentials = await getStoredCredentials();

    if (storedCredentials.some((credential) => credential.email === parsed.email)) {
      throw new Error('An account with this email already exists on this device.');
    }

    const existingUsers = await usersApi.list<BackendUser>();
    const username = buildUniqueUsername(
      parsed.email,
      parsed.displayName,
      existingUsers.map((user) => user.username)
    );

    const createdUser = await usersApi.create<BackendUser>({
      username,
      displayName: parsed.displayName,
    });

    await upsertStoredCredential({
      email: parsed.email,
      password: parsed.password,
      userId: createdUser.id,
      username: createdUser.username,
      displayName: createdUser.displayName,
      createdAt: new Date().toISOString(),
    });

    return createAuthSession(toAuthUser(createdUser, parsed.email), 'password');
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    const parsed = loginSchema.parse(payload);
    const storedCredentials = await getStoredCredentials();
    const matchingCredential = storedCredentials.find((credential) => credential.email === parsed.email);

    if (!matchingCredential) {
      throw new Error('No account found for this email on this device. Create an account first.');
    }

    if (matchingCredential.password !== parsed.password) {
      throw new Error('The password does not match this account.');
    }

    const user = await usersApi.getById<BackendUser>(matchingCredential.userId).catch(async () => {
      const users = await usersApi.list<BackendUser>();
      return users.find((candidate) => candidate.id === matchingCredential.userId) ?? null;
    });

    if (!user) {
      throw new Error('This account was not found on the backend anymore. Register again to reconnect it.');
    }

    return createAuthSession(toAuthUser(user, matchingCredential.email), 'password');
  },
};
