import { type AuthSession } from '@/features/auth/model/auth.types';

let cachedSession: AuthSession | null = null;

export function getCachedSession() {
  return cachedSession;
}

export function getCachedAccessToken() {
  return cachedSession?.accessToken ?? null;
}

export function setCachedSession(session: AuthSession | null) {
  cachedSession = session;
}
