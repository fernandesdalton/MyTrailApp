import { z } from 'zod';
import { router } from 'expo-router';
import { startTransition, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { authScreenStyles as styles } from '@/features/auth/screens/auth-screen.styles';
import { AppText } from '@/shared/ui/app-text';

const loginSchema = z.object({
  identity: z.string().trim().min(1, 'Enter your username.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const registerSchema = z.object({
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters.'),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const socialProviders = [
  { id: 'google', label: 'GOOGLE', status: 'Soon' },
  { id: 'apple', label: 'APPLE', status: 'Soon' },
] as const;

type AuthScreenProps = {
  mode: 'login' | 'register';
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const { signInWithPassword, registerWithPassword } = useAuthSession();
  const [displayName, setDisplayName] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';
  const title = isLogin ? 'NEW LOGIN' : 'TRAILBLAZER';
  const headline = isLogin ? 'Welcome back' : 'JOIN THE PACK';
  const subtitle = isLogin
    ? 'Sign in with your backend account to keep posting, tracking, and saving trails.'
    : 'Create your rider profile to start tracking.';
  const submitLabel = isLogin ? 'SIGN IN' : 'CREATE ACCOUNT';
  const footerLabel = isLogin ? "Don't have an account?" : 'Already have an account?';
  const footerAction = isLogin ? 'Create an account' : 'Sign in';
  const footerRoute = isLogin ? '/(auth)/register' : '/(auth)/login';

  const helperCopy = useMemo(
    () =>
      isLogin
        ? 'This sign-in uses the backend auth API and stores the returned bearer token securely on the device.'
        : 'Create a TrailBlazer account through the backend auth API. The session is stored securely and sent as a bearer token on authenticated requests.',
    [isLogin]
  );

  async function handleSubmit() {
    try {
      setErrorMessage(null);
      setIsSubmitting(true);

      if (isLogin) {
        const parsed = loginSchema.parse({ identity, password });
        await signInWithPassword({
          username: parsed.identity,
          password: parsed.password,
        });
      } else {
        if (password !== confirmPassword) {
          throw new Error('Password and confirmation must match.');
        }

        if (!acceptedTerms) {
          throw new Error('Accept the Terms of Service and Privacy Policy to continue.');
        }

        const parsed = registerSchema.parse({ displayName, email: identity, password });
        await registerWithPassword(parsed);
      }

      startTransition(() => {
        router.replace('/(tabs)');
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues[0]?.message ?? 'Check the form fields and try again.');
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to continue right now.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}>
        <View style={styles.shell}>
          <View style={styles.glowTop} />
          <View style={[styles.card, !isLogin && styles.registerCard]}>
            <View style={[styles.logoBlock, !isLogin && styles.registerLogoBlock]}>
              {!isLogin ? null : (
                <View style={styles.logoMark}>
                  <View style={styles.logoMarkColumn} />
                  <View style={styles.logoMarkColumn} />
                  <View style={styles.logoMarkColumn} />
                </View>
              )}
              <AppText style={[styles.logoWordmark, !isLogin && styles.registerWordmark]}>
                {isLogin ? (
                  <>
                    <AppText style={styles.logoWordmarkWhite}>TRAIL</AppText>
                    <AppText style={styles.logoWordmarkAccent}>BLAZER</AppText>
                  </>
                ) : (
                  <AppText style={styles.logoWordmarkAccent}>{title}</AppText>
                )}
              </AppText>
              {isLogin ? (
                <AppText style={styles.logoTagline}>HIGH PERFORMANCE OFF-ROAD NAVIGATION</AppText>
              ) : null}
            </View>

            <View style={[styles.headerRow, !isLogin && styles.registerHeaderRow]}>
              <AppText style={[styles.headerTitle, !isLogin && styles.registerHeadline]}>{headline}</AppText>
              <AppText style={[styles.helperCopy, !isLogin && styles.registerSubtitle]}>{subtitle}</AppText>
            </View>

            {isLogin ? <AppText style={styles.helperCopy}>{helperCopy}</AppText> : null}

            {!isLogin ? (
              <View style={styles.inputBlock}>
                <AppText style={styles.inputLabel}>FULL NAME</AppText>
                <TextInput
                  autoCapitalize="words"
                  onChangeText={setDisplayName}
                  placeholder="RIDER NAME"
                  placeholderTextColor="#796A72"
                  style={styles.input}
                  value={displayName}
                />
              </View>
            ) : null}

            <View style={styles.inputBlock}>
              <AppText style={styles.inputLabel}>{isLogin ? 'USERNAME' : 'EMAIL ADDRESS'}</AppText>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={isLogin ? 'default' : 'email-address'}
                onChangeText={setIdentity}
                placeholder={isLogin ? 'auth-user' : 'COCKPIT@APEXDIRT.COM'}
                placeholderTextColor="#796A72"
                style={styles.input}
                value={identity}
              />
            </View>

            <View style={styles.inputBlock}>
              <View style={styles.passwordHeader}>
                <AppText style={styles.inputLabel}>PASSWORD</AppText>
                {isLogin ? <AppText style={styles.passwordHint}>FORGOT PASSWORD?</AppText> : null}
              </View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#796A72"
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            {!isLogin ? (
              <View style={styles.inputBlock}>
                <AppText style={styles.inputLabel}>CONFIRM</AppText>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setConfirmPassword}
                  placeholder="********"
                  placeholderTextColor="#796A72"
                  secureTextEntry
                  style={styles.input}
                  value={confirmPassword}
                />
              </View>
            ) : null}

            {!isLogin ? (
              <Pressable onPress={() => setAcceptedTerms((current) => !current)} style={styles.termsRow}>
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
                  {acceptedTerms ? <View style={styles.checkboxDot} /> : null}
                </View>
                <AppText style={styles.termsText}>
                  I agree to the <AppText style={styles.termsLink}>Terms of Service</AppText> and{' '}
                  <AppText style={styles.termsLink}>Privacy Policy</AppText>.
                </AppText>
              </Pressable>
            ) : null}

            {errorMessage ? <AppText style={styles.errorText}>{errorMessage}</AppText> : null}

            <Pressable
              disabled={isSubmitting}
              onPress={() => void handleSubmit()}
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
              {isSubmitting ? (
                <ActivityIndicator color="#130A25" />
              ) : (
                <AppText style={styles.submitLabel}>{submitLabel}</AppText>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <AppText style={styles.dividerLabel}>
                {isLogin ? 'OR CONTINUE WITH' : 'OR CONNECT WITH'}
              </AppText>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              {socialProviders.map((provider) => (
                <Pressable key={provider.id} disabled style={styles.socialButton}>
                  <AppText style={styles.socialLabel}>{provider.label}</AppText>
                  {isLogin ? <AppText style={styles.socialStatus}>{provider.status}</AppText> : null}
                </Pressable>
              ))}
            </View>

            <View style={styles.footerRow}>
              <AppText style={styles.footerLabel}>{footerLabel}</AppText>
              <Pressable onPress={() => router.replace(footerRoute)}>
                <AppText style={styles.footerAction}>{footerAction}</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
