import { DMSans_400Regular, DMSans_700Bold, useFonts } from '@expo-google-fonts/dm-sans';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });

  // ❗️ Only render UI after fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen  name="index" options={{ title: 'SRS Events',   headerTitleStyle: {
              fontFamily: 'DMSans_700Bold', // 👈 DM Sans applied here
              fontSize: 20,
            }, }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
