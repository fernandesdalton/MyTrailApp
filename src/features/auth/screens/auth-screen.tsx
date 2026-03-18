import { z } from 'zod';
import { router } from 'expo-router';
import { startTransition, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

const loginSchema = z.object({
  email: z.email('Enter a valid email address.').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters.'),
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';
  const title = isLogin ? 'NEW LOGIN' : 'TRAILBLAZER';
  const headline = isLogin ? 'Welcome back' : 'JOIN THE PACK';
  const subtitle = isLogin
    ? 'Use the account you created on this device to keep posting, tracking, and saving trails.'
    : 'Create your rider profile to start tracking.';
  const submitLabel = isLogin ? 'SIGN IN' : 'CREATE ACCOUNT';
  const footerLabel = isLogin ? "Don't have an account?" : 'Already have an account?';
  const footerAction = isLogin ? 'Create an account' : 'Sign in';
  const footerRoute = isLogin ? '/(auth)/register' : '/(auth)/login';

  const helperCopy = useMemo(
    () =>
      isLogin
        ? 'Use the account you created on this device. Your backend does not expose auth endpoints yet, so this flow keeps a secure local session on top of your backend user record.'
        : 'Create a TrailBlazer account backed by the existing users API. The token and provider structure is ready for real JWT auth plus Google and Apple later.',
    [isLogin]
  );

  async function handleSubmit() {
    try {
      setErrorMessage(null);
      setIsSubmitting(true);

      if (isLogin) {
        const parsed = loginSchema.parse({ email, password });
        await signInWithPassword(parsed);
      } else {
        if (password !== confirmPassword) {
          throw new Error('Password and confirmation must match.');
        }

        if (!acceptedTerms) {
          throw new Error('Accept the Terms of Service and Privacy Policy to continue.');
        }

        const parsed = registerSchema.parse({ displayName, email, password });
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
              <AppText style={styles.inputLabel}>EMAIL ADDRESS</AppText>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder={isLogin ? 'rider@leapxdirt.com' : 'COCKPIT@APEXDIRT.COM'}
                placeholderTextColor="#796A72"
                style={styles.input}
                value={email}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181A17',
  },
  keyboardArea: {
    flex: 1,
  },
  shell: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'center',
    backgroundColor: '#181A17',
  },
  glowTop: {
    position: 'absolute',
    top: 32,
    left: 36,
    right: 36,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(95, 138, 73, 0.1)',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3A3C37',
    backgroundColor: '#232522',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  registerCard: {
    borderColor: '#6A59FF',
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  logoBlock: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  registerLogoBlock: {
    alignItems: 'flex-start',
    paddingBottom: 0,
  },
  logoMark: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
  },
  logoMarkColumn: {
    width: 5,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  logoWordmark: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  registerWordmark: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  logoWordmarkWhite: {
    color: '#F4F1EC',
  },
  logoWordmarkAccent: {
    color: colors.accent,
  },
  logoTagline: {
    color: '#9E9489',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  headerRow: {
    alignItems: 'center',
  },
  registerHeaderRow: {
    alignItems: 'flex-start',
    gap: 6,
  },
  headerTitle: {
    color: '#EDE7DF',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
  },
  registerHeadline: {
    fontSize: 24,
    lineHeight: 28,
    textTransform: 'uppercase',
  },
  helperCopy: {
    color: '#A39A8F',
    fontSize: 12,
    lineHeight: 17,
  },
  registerSubtitle: {
    color: '#B3A89A',
    fontSize: 13,
    lineHeight: 18,
  },
  inputBlock: {
    gap: 8,
  },
  inputLabel: {
    color: '#E0D9CF',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordHint: {
    color: colors.accent,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#353733',
    backgroundColor: '#2A2C29',
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#F4F1EC',
    fontSize: 14,
    lineHeight: 18,
  },
  errorText: {
    color: '#FFB99A',
    fontSize: 12,
    lineHeight: 16,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 14,
    height: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#6F6A63',
    backgroundColor: '#2A2C29',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: colors.accent,
    backgroundColor: '#332416',
  },
  checkboxDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.accent,
  },
  termsText: {
    flex: 1,
    color: '#A39A8F',
    fontSize: 11,
    lineHeight: 16,
  },
  termsLink: {
    color: '#E7DDD0',
  },
  submitButton: {
    borderRadius: 12,
    backgroundColor: '#FF9B5A',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8A33',
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    color: '#130A25',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3B3D38',
  },
  dividerLabel: {
    color: '#8B8178',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#353733',
    backgroundColor: '#2A2C29',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  socialLabel: {
    color: '#F4F1EC',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },
  socialStatus: {
    color: '#8F857B',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  footerLabel: {
    color: '#A39A8F',
    fontSize: 12,
    lineHeight: 16,
  },
  footerAction: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
});
