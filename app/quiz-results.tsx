import { useLocalSearchParams, useRouter } from "expo-router";
import { Award, Home, RotateCw } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function QuizResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const score = parseInt(params.score as string, 10);
  const total = parseInt(params.total as string, 10);
  const percentage = Math.round((score / total) * 100);
  const passed = score >= 6;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
          <View style={[styles.iconContainer, passed ? styles.passedIcon : styles.failedIcon]}>
            <Award size={64} color="#fff" />
          </View>

          <Text style={[styles.resultTitle, isDark && styles.resultTitleDark]}>
            {passed ? "Congratulations!" : "Keep Studying!"}
          </Text>

          <Text style={[styles.resultSubtitle, isDark && styles.resultSubtitleDark]}>
            {passed
              ? "You passed the practice test!"
              : "You need at least 6/10 to pass"}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, isDark && styles.scoreTextDark]}>
              {score} <Text style={styles.scoreDivider}>/ {total}</Text>
            </Text>
            <Text style={[styles.percentageText, passed ? styles.passedText : styles.failedText]}>
              {percentage}%
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={[styles.messageText, isDark && styles.messageTextDark]}>
              {passed
                ? "Great job! You're ready for the actual test. Keep practicing to maintain your knowledge."
                : "Don't worry! Review the questions and try again. You're making progress!"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push("/quiz")}
            style={[styles.actionButton, styles.retakeButton]}
          >
            <RotateCw size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Retake Quiz</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/")}
            style={[styles.actionButton, styles.homeButton, isDark && styles.homeButtonDark]}
          >
            <Home size={24} color={isDark ? "#fff" : "#1a1a2e"} />
            <Text style={[styles.homeButtonText, isDark && styles.homeButtonTextDark]}>
              Go Home
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  containerDark: {
    backgroundColor: "#1a1a2e",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  resultCardDark: {
    backgroundColor: "#2d3748",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  passedIcon: {
    backgroundColor: "#43e97b",
  },
  failedIcon: {
    backgroundColor: "#f5576c",
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#1a1a2e",
    marginBottom: 8,
  },
  resultTitleDark: {
    color: "#fff",
  },
  resultSubtitle: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 24,
  },
  resultSubtitleDark: {
    color: "#adb5bd",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 56,
    fontWeight: "800" as const,
    color: "#1a1a2e",
  },
  scoreTextDark: {
    color: "#fff",
  },
  scoreDivider: {
    fontSize: 40,
    fontWeight: "600" as const,
    color: "#adb5bd",
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginTop: 8,
  },
  passedText: {
    color: "#43e97b",
  },
  failedText: {
    color: "#f5576c",
  },
  messageContainer: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    width: "100%",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
    textAlign: "center",
  },
  messageTextDark: {
    color: "#cbd5e0",
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  retakeButton: {
    backgroundColor: "#4facfe",
  },
  homeButton: {
    backgroundColor: "#fff",
  },
  homeButtonDark: {
    backgroundColor: "#2d3748",
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  homeButtonTextDark: {
    color: "#fff",
  },
});
