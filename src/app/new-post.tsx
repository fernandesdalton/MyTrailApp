import { Redirect } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { NewPostScreen } from '@/features/posts/screens/new-post-screen';

export default function NewPostRoute() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return <NewPostScreen />;
}
