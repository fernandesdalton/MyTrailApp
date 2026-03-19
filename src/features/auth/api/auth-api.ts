import { z } from 'zod';

import { type AuthSession, type AuthUser, type LoginPayload, type RegisterPayload } from '@/features/auth/model/auth.types';
import { apiGet, apiPost } from '@/shared/lib/api/api-client';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Enter your username.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const registerSchema = z.object({
  username: z.string().trim().min(3).optional(),
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters.'),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type BackendAuthUser = {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  locationLabel?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type BackendAuthResponse = {
  accessToken: string;
  tokenType?: string;
  expiresAt: string;
  refreshToken?: string | null;
  user: BackendAuthUser;
};

function slugifyUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);
}

function toAuthUser(user: BackendAuthUser, email?: string): AuthUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
    locationLabel: user.locationLabel ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email,
  };
}

function toAuthSession(response: BackendAuthResponse, email?: string): AuthSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken ?? null,
    expiresAt: response.expiresAt,
    provider: 'password',
    tokenType: response.tokenType ?? 'bearer',
    user: toAuthUser(response.user, email),
  };
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthSession> {
    const parsed = registerSchema.parse(payload);
    const username = parsed.username?.trim() || slugifyUsername(parsed.email.split('@')[0] ?? parsed.displayName);

    const response = await apiPost<BackendAuthResponse>('/auth/register', {
      username,
      displayName: parsed.displayName,
      email: parsed.email,
      password: parsed.password,
    });

    return toAuthSession(response, parsed.email);
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    const parsed = loginSchema.parse(payload);
    const response = await apiPost<BackendAuthResponse>('/auth/login', {
      username: parsed.username,
      password: parsed.password,
    });

    return toAuthSession(response);
  },

  async getMe() {
    const user = await apiGet<BackendAuthUser>('/auth/me');
    return toAuthUser(user);
  },

  async logout() {
    await apiPost('/auth/logout');
  },

  async getProviders() {
    return apiGet<{ id: string; label: string }[]>('/auth/providers');
  },
};
