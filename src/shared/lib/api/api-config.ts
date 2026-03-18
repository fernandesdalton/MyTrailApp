import Constants from 'expo-constants';
import { Platform } from 'react-native';

const explicitBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    null;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] ?? null;
}

function resolveBaseUrl() {
  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  if (Platform.OS === 'android') {
    const expoHost = getExpoHost();
    return expoHost ? `http://${expoHost}:8000` : 'http://10.0.2.2:8000';
  }

  return 'http://127.0.0.1:8000';
}

export const apiConfig = {
  baseUrl: resolveBaseUrl(),
  prefix: '/api/v1',
  docsUrl: `${resolveBaseUrl()}/docs`,
  openApiUrl: `${resolveBaseUrl()}/openapi.json`,
} as const;

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiConfig.baseUrl}${apiConfig.prefix}${normalizedPath}`;
}
