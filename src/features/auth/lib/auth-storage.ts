import * as SecureStore from 'expo-secure-store';

import { type AuthSession } from '@/features/auth/model/auth.types';

const SESSION_STORAGE_KEY = 'trailblazer.auth.session';

async function readJson<T>(key: string) {
  const raw = await SecureStore.getItemAsync(key);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
}

async function writeJson(key: string, value: unknown) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function getStoredSession() {
  return readJson<AuthSession>(SESSION_STORAGE_KEY);
}

export async function setStoredSession(session: AuthSession) {
  await writeJson(SESSION_STORAGE_KEY, session);
}

export async function clearStoredSession() {
  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}
