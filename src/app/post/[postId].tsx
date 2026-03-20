import { Redirect, useLocalSearchParams } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { PostScreen } from '@/features/posts/screens/post-screen';

export default function PostRoute() {
  const { status } = useAuthSession();
  const params = useLocalSearchParams<{ postId?: string | string[] }>();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;

  if (status === 'loading') {
    return null;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  if (!postId) {
    return null;
  }

  return <PostScreen postId={postId} />;
}
