import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StudyProvider } from "../contexts/StudyContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
      <Stack.Screen name="all-questions" options={{ title: "All Questions" }} />
      <Stack.Screen name="flashcards" options={{ title: "Flashcards" }} />
      <Stack.Screen name="quiz" options={{ title: "Quiz Mode" }} />
      <Stack.Screen name="quiz-results" options={{ title: "Quiz Results", headerBackVisible: false }} />
      <Stack.Screen name="progress" options={{ title: "Your Progress" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <StudyProvider>
          <RootLayoutNav />
        </StudyProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
