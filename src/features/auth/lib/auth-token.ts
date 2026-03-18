import { type AuthProvider, type AuthSession, type AuthUser } from '@/features/auth/model/auth.types';

function makeOpaqueToken(prefix: 'atk' | 'rtk') {
  const suffix = Math.random().toString(36).slice(2, 14);
  return `${prefix}_${Date.now()}_${suffix}`;
}

export function createAuthSession(user: AuthUser, provider: AuthProvider): AuthSession {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

  return {
    accessToken: makeOpaqueToken('atk'),
    refreshToken: makeOpaqueToken('rtk'),
    expiresAt,
    provider,
    user,
  };
}
