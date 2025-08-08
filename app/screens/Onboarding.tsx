import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();

  const slides = [
    { id: 1, text: "Welcome to Event Store!" },
    { id: 2, text: "Discover amazing events near you" },
    { id: 3, text: "Get started now" },
  ];

  return (
    <Swiper loop={false} showsPagination={true} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
      {slides.map((slide, index) => (
        <View key={slide.id} style={styles.slide}>
          <Text style={styles.text}>{slide.text}</Text>

          {index === slides.length - 1 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/sign-in" as any)} // This will be Clerk auth page later
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 22,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#007bff",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
