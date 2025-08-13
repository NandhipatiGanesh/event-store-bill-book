import { TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const TabButton = (props: any) => {
  const focused = props.accessibilityState?.selected;
  const scale = useSharedValue(focused ? 1.1 : 1);
  
  scale.value = withSpring(focused ? 1.1 : 1, {
    damping: 10,
    stiffness: 150
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableWithoutFeedback {...props}>
      <Animated.View
        style={[
          {
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            // Force remove all internal padding
            padding: 0,
            margin: 0,
          },
          animatedStyle
        ]}
      >
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default TabButton;