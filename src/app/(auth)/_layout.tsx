import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function AuthLayout() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
