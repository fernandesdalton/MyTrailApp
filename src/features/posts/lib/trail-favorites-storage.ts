import * as SecureStore from 'expo-secure-store';

const FAVORITES_STORAGE_KEY = 'trailblazer.posts.favorite-trails';

const seededFavoritesByUser: Record<string, string[]> = {
  '11111111-1111-4111-8111-111111111111': [
    '33333333-3333-4333-8333-333333333333',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555555',
  ],
};

type FavoriteMap = Record<string, string[]>;

async function readFavoriteMap() {
  const raw = await SecureStore.getItemAsync(FAVORITES_STORAGE_KEY);

  if (!raw) {
    return {} as FavoriteMap;
  }

  return JSON.parse(raw) as FavoriteMap;
}

async function writeFavoriteMap(value: FavoriteMap) {
  await SecureStore.setItemAsync(FAVORITES_STORAGE_KEY, JSON.stringify(value));
}

export async function getFavoriteTrailIds(userId: string) {
  const favoriteMap = await readFavoriteMap();
  return favoriteMap[userId] ?? seededFavoritesByUser[userId] ?? [];
}

export async function setFavoriteTrailIds(userId: string, trailIds: string[]) {
  const favoriteMap = await readFavoriteMap();
  favoriteMap[userId] = trailIds;
  await writeFavoriteMap(favoriteMap);
}
