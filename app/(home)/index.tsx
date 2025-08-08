import { SignOutButton } from '@/components/SignOutButton'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Page() {
  const { user } = useUser()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
       <Link href={"/sign-in" as any}>
       <Text>Sign in</Text>
     </Link>

     <Link href={"/sign-up" as any}>
       <Text>Sign up</Text>
     </Link>

      </SignedOut>
    </View>
  )
}