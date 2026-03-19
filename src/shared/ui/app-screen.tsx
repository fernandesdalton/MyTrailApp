import { type PropsWithChildren } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appScreenStyles as styles } from '@/shared/ui/app-screen.styles';

type AppScreenProps = PropsWithChildren<{
  contentContainerStyle?: ViewStyle;
}>;

export function AppScreen({ children, contentContainerStyle }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.contentContainer, contentContainerStyle]}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
