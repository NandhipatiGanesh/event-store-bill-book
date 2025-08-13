//File : /app/(tabs)/_layout.tsx
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import AdminIcon from '../../assets/icons/AdminIcon';
import ExploreIcon from '../../assets/icons/ExploreIcon';
import HomeIcon from '../../assets/icons/HomeIcon';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

type IconComponentType = React.ComponentType<{ size?: number; color?: string }>;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState('false');

   const wrapIcon =
  (IconComponent: IconComponentType) =>
  ({ color, focused }: TabBarIconProps) =>
    (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}
      >
        <IconComponent
          size={24}
          color={
            focused
              ? Colors[colorScheme ?? 'light'].tint
              : Colors[colorScheme ?? 'light'].tabIconDefault
          }
        />
      </View>
    );


  return (
      <Tabs
  screenOptions={{
    // ... other options
     headerShown: false,
    tabBarShowLabel: false,
      tabBarStyle: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: "translate(-50%, 10%)",
      right: 20,
      height: 60,
      width: '80%',
      borderRadius: 30,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      paddingHorizontal: 0, // Remove horizontal padding
      paddingBottom: 0,    // Ensure no bottom padding
    },
    tabBarIconStyle: {
      margin: 0,
      padding: 0,
    }
  }}

>
      <Tabs.Screen
        name="index"
        options={{
      tabBarIcon: wrapIcon(HomeIcon),
      tabBarItemStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 50,
        backgroundColor: activeTab === 'index' ? '#f0f8ff' : 'transparent',
      },
    }}
      />
      <Tabs.Screen
        name="explore"
        options={{
        
          tabBarIcon: wrapIcon(ExploreIcon),
            tabBarItemStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 50,
        backgroundColor: activeTab === 'explore' ? '#f0f8ff' : 'transparent',
      },
        }}
      />
    
      <Tabs.Screen
        name="admin-login"
        options={{
          
          tabBarIcon: wrapIcon(AdminIcon),
            tabBarItemStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 50,
        backgroundColor: activeTab === 'admin-login' ? '#f0f8ff' : 'transparent',
      },
        }}
      />
            

    </Tabs>
  );
}
