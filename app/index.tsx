import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BookOpen, Brain, LayoutList, TrendingUp } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { CIVICS_QUESTIONS } from "../constants/civicsQuestions";
import { useStudy } from "../contexts/StudyContext";

interface MenuButtonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  colors: [string, string];
}

function MenuButton({ title, subtitle, icon, onPress, colors }: MenuButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuButton,
        Platform.OS === "ios" && pressed && styles.menuButtonPressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient colors={colors} style={styles.menuGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.menuContent}>
          <View style={styles.menuIcon}>
            <Text>{icon}</Text>
          </View>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>{title}</Text>
            <Text style={styles.menuSubtitle}>{subtitle}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { masteredQuestions, quizHistory } = useStudy();
  const insets = useSafeAreaInsets();

  const masteredCount = masteredQuestions.size;
  const totalQuestions = CIVICS_QUESTIONS.length;
  const masteredPercentage = Math.round((masteredCount / totalQuestions) * 100);

  const recentQuizCount = quizHistory.slice(-5).length;
  const recentAverage =
    recentQuizCount > 0
      ? Math.round(
          quizHistory
            .slice(-5)
            .reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / recentQuizCount
        )
      : 0;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={isDark ? ["#1a1a2e", "#16213e"] : ["#f8f9fa", "#e9ecef"]}
        style={styles.background}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, isDark && styles.titleDark]}>US Civics Test</Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                Master 100 Questions for Naturalization
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={[styles.statBox, isDark && styles.statBoxDark]}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>{masteredPercentage}%</Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Mastered</Text>
              </View>
              <View style={[styles.statBox, isDark && styles.statBoxDark]}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>{quizHistory.length}</Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Quizzes</Text>
              </View>
              <View style={[styles.statBox, isDark && styles.statBoxDark]}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>{recentAverage}%</Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Avg Score</Text>
              </View>
            </View>

            <View style={styles.menuContainer}>
              <MenuButton
                title="View All Questions"
                subtitle="Browse all 100 questions"
                icon={<LayoutList size={32} color="#fff" />}
                colors={["#667eea", "#764ba2"]}
                onPress={() => router.push("/all-questions")}
              />

              <MenuButton
                title="Flashcards"
                subtitle="Study with flip cards"
                icon={<BookOpen size={32} color="#fff" />}
                colors={["#f093fb", "#f5576c"]}
                onPress={() => router.push("/flashcards")}
              />

              <MenuButton
                title="Quiz Mode"
                subtitle="Take a practice test"
                icon={<Brain size={32} color="#fff" />}
                colors={["#4facfe", "#00f2fe"]}
                onPress={() => router.push("/quiz")}
              />

              <MenuButton
                title="Track Progress"
                subtitle="View your study stats"
                icon={<TrendingUp size={32} color="#fff" />}
                colors={["#43e97b", "#38f9d7"]}
                onPress={() => router.push("/progress")}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
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
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: "#1a1a2e",
    marginBottom: 8,
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "500" as const,
  },
  subtitleDark: {
    color: "#adb5bd",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statBoxDark: {
    backgroundColor: "#2d3748",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#667eea",
    marginBottom: 4,
  },
  statValueDark: {
    color: "#a78bfa",
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "600" as const,
  },
  statLabelDark: {
    color: "#adb5bd",
  },
  menuContainer: {
    gap: 16,
  },
  menuButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  menuButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  menuGradient: {
    padding: 20,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500" as const,
  },
});
