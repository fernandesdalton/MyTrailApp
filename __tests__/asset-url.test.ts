/* eslint-disable import/first */
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('resolveAssetUrl', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('prefixes relative media paths with the configured S3 public base URL', () => {
    process.env.S3_PUBLIC_BASE_URL = 'http://10.0.2.2:9000';
    const { resolveAssetUrl } = require('@/shared/lib/api/asset-url');

    expect(resolveAssetUrl('/uploads/photo.jpg')).toBe('http://10.0.2.2:9000/uploads/photo.jpg');
    expect(resolveAssetUrl('uploads/photo.jpg')).toBe('http://10.0.2.2:9000/uploads/photo.jpg');
  });

  it('keeps absolute remote urls unchanged', () => {
    process.env.S3_PUBLIC_BASE_URL = 'http://10.0.2.2:9000';
    const { resolveAssetUrl } = require('@/shared/lib/api/asset-url');

    expect(resolveAssetUrl('https://example.com/photo.jpg')).toBe('https://example.com/photo.jpg');
  });

  it('rewrites internal storage hosts to the configured public base url', () => {
    process.env.S3_PUBLIC_BASE_URL = 'http://10.0.2.2:9000';
    const { resolveAssetUrl } = require('@/shared/lib/api/asset-url');

    expect(resolveAssetUrl('http://minio:9000/uploads/photo.jpg')).toBe(
      'http://10.0.2.2:9000/uploads/photo.jpg'
    );
    expect(resolveAssetUrl('http://127.0.0.1:9000/uploads/photo.jpg')).toBe(
      'http://10.0.2.2:9000/uploads/photo.jpg'
    );
  });
});
