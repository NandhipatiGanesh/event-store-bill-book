// app/index.tsx
import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Home ✅</Text>
      <Text>{isSignedIn ? 'Signed in' : 'Signed out'}</Text>

      <Pressable
        style={{ padding: 10, backgroundColor: '#111', borderRadius: 10 }}
        onPress={async () => {
          await AsyncStorage.removeItem('onboardingComplete');
          router.replace('/onboarding');
        }}
      >
        <Text style={{ color: '#fff' }}>Reset onboarding</Text>
      </Pressable>

      {isSignedIn && (
        <Pressable
          style={{ padding: 10, backgroundColor: '#444', borderRadius: 10 }}
          onPress={async () => {
            await signOut();
            await AsyncStorage.removeItem('onboardingComplete');
            router.replace('/onboarding');
          }}
        >
          <Text style={{ color: '#fff' }}>Sign out</Text>
        </Pressable>
      )}
    </View>
  );
}
