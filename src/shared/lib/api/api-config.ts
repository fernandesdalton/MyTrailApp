import { Platform } from 'react-native';

const explicitBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const selectedEnvironment = process.env.EXPO_PUBLIC_APP_ENV?.trim().toLowerCase() || 'local';

const baseUrlsByEnvironment = {
  local: process.env.EXPO_PUBLIC_API_BASE_URL_LOCAL?.trim() || 'http://127.0.0.1:8000',
  dev:
    process.env.EXPO_PUBLIC_API_BASE_URL_DEV?.trim() ||
    'http://my-trail-app-dev-alb-1467436399.us-east-1.elb.amazonaws.com',
  production: process.env.EXPO_PUBLIC_API_BASE_URL_PRODUCTION?.trim() || '',
} as const;

function resolveBaseUrl() {
  if (explicitBaseUrl) {
    return normalizeBaseUrl(explicitBaseUrl);
  }

  return normalizeBaseUrl(
    baseUrlsByEnvironment[selectedEnvironment as keyof typeof baseUrlsByEnvironment] ?? ''
  );
}

function normalizeBaseUrl(baseUrl: string) {
  if (!baseUrl) {
    return '';
  }

  if (Platform.OS !== 'android') {
    return baseUrl;
  }

  return baseUrl
    .replace('http://127.0.0.1', 'http://10.0.2.2')
    .replace('http://localhost', 'http://10.0.2.2');
}

function requireBaseUrl() {
  const baseUrl = resolveBaseUrl();

  if (baseUrl) {
    return baseUrl;
  }

  throw new Error(
    `API base URL is not configured for environment "${selectedEnvironment}". ` +
      'Set EXPO_PUBLIC_API_BASE_URL or provide the matching EXPO_PUBLIC_API_BASE_URL_<ENV> value.'
  );
}

export const apiConfig = {
  environment: selectedEnvironment,
  baseUrl: resolveBaseUrl(),
  prefix: '/api/v1',
  docsUrl: apiConfigUrl('/docs'),
  openApiUrl: apiConfigUrl('/openapi.json'),
} as const;

function apiConfigUrl(path: string) {
  const baseUrl = resolveBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : '';
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${requireBaseUrl()}${apiConfig.prefix}${normalizedPath}`;
}
