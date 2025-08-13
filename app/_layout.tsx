import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

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
  if (!done && !pathname.startsWith('/onboarding')) return <Redirect href="/onboarding" />;
  if (done && pathname.startsWith('/onboarding')) return <Redirect href="/" />;

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: 'black' }} />;
  }

  const pk = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  if (!pk) throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');

  return (
    <ClerkProvider publishableKey={pk} tokenCache={tokenCache}>
      <Gate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding/index" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Gate>
    </ClerkProvider>
  );
}
