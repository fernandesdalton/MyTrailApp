import { Platform } from 'react-native';

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

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function getS3PublicBaseUrl() {
  return (
    process.env.EXPO_PUBLIC_S3_PUBLIC_BASE_URL?.trim() ?? process.env.S3_PUBLIC_BASE_URL?.trim() ?? ''
  );
}

function shouldRewriteHost(hostname: string) {
  const normalizedHostname = hostname.trim().toLowerCase();
  return ['127.0.0.1', 'localhost', 'minio'].includes(normalizedHostname);
}

export function resolveAssetUrl(url?: string | null) {
  if (!url) {
    return url ?? null;
  }

  if (isAbsoluteUrl(url) || url.startsWith('file:') || url.startsWith('content:')) {
    if (!isAbsoluteUrl(url)) {
      return url;
    }

    const baseUrl = normalizeBaseUrl(getS3PublicBaseUrl());
    if (!baseUrl) {
      return url;
    }

    try {
      const parsedUrl = new URL(url);
      if (!shouldRewriteHost(parsedUrl.hostname)) {
        return url;
      }

      const parsedBaseUrl = new URL(baseUrl);
      return `${parsedBaseUrl.origin}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
      return url;
    }

    return url;
  }

  const baseUrl = normalizeBaseUrl(getS3PublicBaseUrl());
  if (!baseUrl) {
    return url;
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${normalizedPath}`;
}
