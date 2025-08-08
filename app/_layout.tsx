// app/_layout.tsx
import 'react-native-reanimated'; // must be first

import { ClerkProvider } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

function Gate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem('onboardingComplete');
        if (!mounted) return;
        setDone(v === 'true');
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!ready) return null;

  // if not done and we're not already on onboarding → go to onboarding
  if (!done && !pathname.startsWith('/onboarding')) {
    return <Redirect href="/onboarding" />;
  }

  // if done and still on onboarding → go home
  if (done && pathname.startsWith('/onboarding')) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const pk = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

  return (
    <ClerkProvider publishableKey={pk}>
      <Gate>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        </Stack>
      </Gate>
    </ClerkProvider>
  );
}
