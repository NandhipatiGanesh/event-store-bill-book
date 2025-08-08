// app/onboarding/index.tsx
import { useAuth, useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: any; // require(...) asset
};

const SLIDES: Slide[] = [
  { key: '1', title: 'Discover events', subtitle: 'Find things to do around you, any day.', image: require('../../assets/firstscreen.png') },
  { key: '2', title: 'Save your favorites', subtitle: 'Keep track and get reminders.', image: require('../../assets/secondscreen.png') },
  { key: '3', title: 'Join the community', subtitle: 'Create, share, and RSVP in a tap.', image: require('../../assets/thirdscreen.png') },
];

type EmailStep = 'idle' | 'enter' | 'sending' | 'verify' | 'verifying';
type EmailMode = 'signin' | 'signup' | null;

export default function Onboarding() {
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [page, setPage] = useState(0);

  // Email OTP UI
  const [emailStep, setEmailStep] = useState<EmailStep>('idle');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailMode, setEmailMode] = useState<EmailMode>(null); // which path we're on

  const { isSignedIn } = useAuth();
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebook } = useOAuth({ strategy: 'oauth_facebook' });
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  // ---------- paging ----------
  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, SLIDES.length - 1));
    listRef.current?.scrollToOffset({ offset: clamped * width, animated: true });
  };
  const next = () => goTo(page + 1);
  const skip = () => goTo(SLIDES.length - 1);

  const finish = useCallback(async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    router.replace('/');
  }, [router]);

  // ---------- OAuth ----------
  const handleOAuth = useCallback(
    async (startFlow: typeof startGoogle) => {
      try {
        const { createdSessionId, setActive: setActiveFromOAuth } = await startFlow({});
        if (createdSessionId && setActiveFromOAuth) {
          await setActiveFromOAuth({ session: createdSessionId });
        }
        await finish();
      } catch (e) {
        console.warn('OAuth failed:', e);
      }
    },
    [finish]
  );

  // ---------- Email OTP ----------
  const sendEmailCode = useCallback(async () => {
    if (!signInLoaded || !signUpLoaded) return;
    try {
      setEmailStep('sending');

      // 1) Try SIGN IN path
      await signIn.create({ identifier: email.trim() });

      // Find the email_code factor to get emailAddressId (Clerk wants it)
      const emailFactor =
        (signIn.supportedFirstFactors || []).find(
          (f: any) => f.strategy === 'email_code'
        ) as { emailAddressId?: string } | undefined;

      await signIn.prepareFirstFactor({
        strategy: 'email_code',
        // @ts-expect-error clerk types vary; sending id when present is safest
        emailAddressId: emailFactor?.emailAddressId,
      });

      setEmailMode('signin');
      setEmailStep('verify');
    } catch (err: any) {
      // 2) If identifier not found -> SIGN UP path
      const notFound =
        err?.errors?.some((e: any) => e?.code === 'form_identifier_not_found') ||
        err?.status === 422;

      if (!notFound) {
        console.warn('sendEmailCode sign-in failed:', err);
        setEmailStep('enter');
        return;
      }

      try {
        await signUp.create({ emailAddress: email.trim() });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setEmailMode('signup');
        setEmailStep('verify');
      } catch (e) {
        console.warn('sendEmailCode sign-up failed:', e);
        setEmailStep('enter');
      }
    }
  }, [email, signIn, signInLoaded, signUp, signUpLoaded]);

  const verifyEmailCode = useCallback(async () => {
    if (!signInLoaded || !signUpLoaded) return;

    try {
      setEmailStep('verifying');

      if (emailMode === 'signin') {
        const res = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code: code.trim(),
        });

        if (res.status === 'complete' && res.createdSessionId) {
          await setActive!({ session: res.createdSessionId });
          await finish();
          return;
        }

        console.warn('Sign-in email code not complete:', res);
        setEmailStep('verify');
        return;
      }

      if (emailMode === 'signup') {
        const ver = await signUp.attemptEmailAddressVerification({ code: code.trim() });
       
              if (ver?.status === 'complete' && ver?.createdSessionId) {
         await setActive!({ session: ver.createdSessionId });
         await finish();
         return;
       }

        // Case 2: some Clerk versions put the session id on `signUp` after verification
        const maybeSessionId = (signUp as any)?.createdSessionId;
        if (typeof maybeSessionId === 'string' && maybeSessionId.length > 0) {
          await setActive!({ session: maybeSessionId });
          await finish();
          return;
        }

        console.warn('Sign-up email verification not complete:', ver);
        setEmailStep('verify');
        return;

      }

      // if somehow no mode, reset
      setEmailStep('enter');
    } catch (e) {
      console.warn('verifyEmailCode failed:', e);
      setEmailStep('verify');
    }
  }, [code, emailMode, finish, setActive, signIn, signInLoaded, signUp, signUpLoaded]);

  // ---------- Render ----------
  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const isLast = index === SLIDES.length - 1;
    return (
      <ImageBackground source={item.image} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          {!isLast ? (
            <View style={styles.row}>
              <Pressable onPress={skip} style={[styles.btn, styles.ghost]}>
                <Text style={[styles.btnText, styles.ghostText]}>Skip</Text>
              </Pressable>
              <Pressable onPress={next} style={styles.btn}>
                <Text style={styles.btnText}>Next</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {/* OAuth */}
              <Pressable onPress={() => handleOAuth(startGoogle)} style={styles.btn}>
                <Text style={styles.btnText}>Continue with Google</Text>
              </Pressable>
              <Pressable onPress={() => handleOAuth(startFacebook)} style={[styles.btn, styles.secondary]}>
                <Text style={styles.btnText}>Continue with Facebook</Text>
              </Pressable>

              {/* Email OTP */}
              {emailStep === 'idle' && (
                <Pressable onPress={() => setEmailStep('enter')} style={[styles.btn, styles.ghost]}>
                  <Text style={[styles.btnText, styles.ghostText]}>Sign in with Email</Text>
                </Pressable>
              )}

              {(emailStep === 'enter' || emailStep === 'sending') && (
                <View style={{ gap: 8 }}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    style={styles.input}
                  />
                  {(() => {
                    const isSending = emailStep === 'sending';
                    return (
                      <Pressable
                        onPress={sendEmailCode}
                        disabled={!email.trim() || isSending}
                        style={[styles.btn, isSending && styles.disabled]}
                      >
                        <Text style={styles.btnText}>{isSending ? 'Sending…' : 'Send code'}</Text>
                      </Pressable>
                    );
                  })()}
                </View>
              )}

              {(emailStep === 'verify' || emailStep === 'verifying') && (
                <View style={{ gap: 8 }}>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter 6-digit code"
                    keyboardType="number-pad"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    style={styles.input}
                  />
                  {(() => {
                    const isVerifying = emailStep === 'verifying';
                    return (
                      <Pressable
                        onPress={verifyEmailCode}
                        disabled={!code.trim() || isVerifying}
                        style={[styles.btn, isVerifying && styles.disabled]}
                      >
                        <Text style={styles.btnText}>{isVerifying ? 'Verifying…' : 'Verify & continue'}</Text>
                      </Pressable>
                    );
                  })()}
                </View>
              )}

              {isSignedIn ? (
                <Pressable onPress={finish} style={[styles.btn, styles.secondary]}>
                  <Text style={styles.btnText}>I’m signed in — Finish</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>

        <View style={styles.dots}>
          {SLIDES.map((_, di) => (
            <View key={di} style={[styles.dot, di === page && styles.dotActive]} />
          ))}
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== page) setPage(i);
        }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { width, height, justifyContent: 'flex-end' },
  bgImage: { resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  content: { padding: 24, gap: 10, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#fff', fontSize: 16, opacity: 0.9 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center' },
  secondary: { backgroundColor: '#333' },
  disabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  ghostText: { color: '#fff' },
  dots: { position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff' },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    color: '#fff',
  },
});
