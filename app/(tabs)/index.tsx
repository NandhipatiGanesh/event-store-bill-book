// import { useAuth } from '@clerk/clerk-expo';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useRouter } from 'expo-router';
// import { useLayoutEffect } from 'react';
// import { Pressable, Text, View } from 'react-native';
import ToolsListScreen from '../screens/ToolsListScreen';

// export default function Order() {
 
// }


export default function Index() {
  // const router = useRouter();
  // const { isSignedIn, signOut } = useAuth();
  // const nav = useNavigation();

  // useLayoutEffect(() => {
  //   nav.setOptions({ headerShown: false });
  // }, [nav]);

  return (
    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
    //   <Text style={{ fontFamily: 'DMSans_400Regular' }}>Home ✅</Text>
    //   <Text style={{ fontFamily: 'DMSans_400Regular' }}>
    //     {isSignedIn ? 'Signed in' : 'Signed out'}
    //   </Text>

    //   <Pressable
    //     style={{ padding: 10, backgroundColor: '#111', borderRadius: 10 }}
    //     onPress={async () => {
    //       await AsyncStorage.removeItem('onboardingComplete');
    //       router.replace('/onboarding');
    //     }}
    //   >
    //     <Text style={{ color: '#fff', fontFamily: 'DMSans_400Regular' }}>
    //       Reset onboarding
    //     </Text>
    //   </Pressable>
    //     <Pressable onPress={() => router.push('/order')}>
    //     <Text>Book shamina now</Text>
    //   </Pressable>

    //   {isSignedIn && (
    //     <Pressable
    //       style={{ padding: 10, backgroundColor: '#444', borderRadius: 10 }}
    //       onPress={async () => {
    //         await signOut();
    //         await AsyncStorage.removeItem('onboardingComplete');
    //         router.replace('/onboarding');
    //       }}
    //     >
    //       <Text style={{ color: '#fff', fontFamily: 'DMSans_400Regular' }}>Sign out</Text>
    //     </Pressable>
    //   )}
    // </View>
     <ToolsListScreen />
  );
}
