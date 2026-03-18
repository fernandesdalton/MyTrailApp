import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { queryClient } from '@/shared/lib/react-query/query-client';
import { darkNavigationTheme, lightNavigationTheme } from '@/shared/theme/navigation-theme';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider value={isDark ? darkNavigationTheme : lightNavigationTheme}>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
