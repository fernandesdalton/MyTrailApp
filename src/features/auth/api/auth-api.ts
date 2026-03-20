import { z } from 'zod';

import { type AuthSession, type AuthUser, type LoginPayload, type RegisterPayload } from '@/features/auth/model/auth.types';
import { resolveAssetUrl } from '@/shared/lib/api/asset-url';
import { ApiError, apiGet, apiPost } from '@/shared/lib/api/api-client';

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

function buildUsernameCandidates(payload: z.infer<typeof registerSchema>) {
  const explicitUsername = payload.username?.trim();
  if (explicitUsername) {
    return [explicitUsername];
  }

  const bases = [
    slugifyUsername(payload.email.split('@')[0] ?? ''),
    slugifyUsername(payload.displayName),
    'trailblazer',
  ].filter(Boolean);
  const uniqueBases = [...new Set(bases)];
  const [primaryBase = 'trailblazer'] = uniqueBases;

  const candidates = uniqueBases.slice(0, 2);
  for (let index = 1; index <= 4; index += 1) {
    candidates.push(`${primaryBase}_${Math.floor(1000 + Math.random() * 9000)}`);
  }

  return [...new Set(candidates.map((candidate) => candidate.slice(0, 30)).filter(Boolean))];
}

function payloadMentionsEmail(payload: unknown) {
  if (typeof payload === 'string') {
    return payload.toLowerCase().includes('email');
  }

  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return Object.values(payload).some(
    (value) => typeof value === 'string' && value.toLowerCase().includes('email')
  );
}

function toAuthUser(user: BackendAuthUser, email?: string): AuthUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: resolveAssetUrl(user.avatarUrl),
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
    const usernameCandidates = buildUsernameCandidates(parsed);
    let lastError: unknown;

    for (const username of usernameCandidates) {
      try {
        const response = await apiPost<BackendAuthResponse>('/auth/register', {
          username,
          displayName: parsed.displayName,
          email: parsed.email,
          password: parsed.password,
        });

        return toAuthSession(response, parsed.email);
      } catch (error) {
        lastError = error;

        if (!(error instanceof ApiError) || error.status !== 409 || parsed.username?.trim()) {
          throw error;
        }

        if (payloadMentionsEmail(error.payload)) {
          throw error;
        }
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Unable to create an account right now.');
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
