import { postsApi } from '@/shared/lib/api/resources/posts-api';

export type PostPhotoUploadInput = {
  uri: string;
  width?: number;
  height?: number;
  blurhash?: string | null;
  mimeType?: string | null;
  fileName?: string | null;
};

function getDefaultFileName(mimeType?: string | null) {
  if (mimeType?.includes('png')) {
    return 'photo.png';
  }

  if (mimeType?.includes('webp')) {
    return 'photo.webp';
  }

  return 'photo.jpg';
}

function buildUploadFormData(input: PostPhotoUploadInput) {
  const formData = new FormData();

  formData.append(
    'file',
    {
      uri: input.uri,
      name: input.fileName ?? getDefaultFileName(input.mimeType),
      type: input.mimeType ?? 'image/jpeg',
    } as unknown as Blob
  );

  if (input.width) {
    formData.append('width', String(input.width));
  }

  if (input.height) {
    formData.append('height', String(input.height));
  }

  if (input.blurhash) {
    formData.append('blurhash', input.blurhash);
  }

  return formData;
}

export async function uploadPostPhoto(postId: string, input: PostPhotoUploadInput) {
  return postsApi.uploadPhoto(postId, buildUploadFormData(input));
}
