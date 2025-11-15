import { AlertCircle, Award, BarChart3, Calendar, RotateCcw } from "lucide-react-native";
import React from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { CIVICS_QUESTIONS } from "../constants/civicsQuestions";
import { useStudy } from "../contexts/StudyContext";

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { masteredQuestions, quizHistory, resetProgress } = useStudy();

  const masteredCount = masteredQuestions.size;
  const totalQuestions = CIVICS_QUESTIONS.length;
  const masteredPercentage = Math.round((masteredCount / totalQuestions) * 100);

  const totalQuizzes = quizHistory.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) /
            totalQuizzes
        )
      : 0;

  const bestScore =
    totalQuizzes > 0
      ? Math.max(...quizHistory.map((quiz) => Math.round((quiz.score / quiz.totalQuestions) * 100)))
      : 0;

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetProgress(),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => (
          <>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <View style={[styles.statIcon, styles.statIconPurple]}>
                  <Award size={28} color="#fff" />
                </View>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                  {masteredPercentage}%
                </Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                  Questions Mastered
                </Text>
                <Text style={[styles.statDetail, isDark && styles.statDetailDark]}>
                  {masteredCount} / {totalQuestions}
                </Text>
              </View>

              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <View style={[styles.statIcon, styles.statIconBlue]}>
                  <BarChart3 size={28} color="#fff" />
                </View>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                  {averageScore}%
                </Text>
                <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                  Average Quiz Score
                </Text>
                <Text style={[styles.statDetail, isDark && styles.statDetailDark]}>
                  {totalQuizzes} {totalQuizzes === 1 ? "quiz" : "quizzes"} taken
                </Text>
              </View>
            </View>

            <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                  Best Quiz Score
                </Text>
                <Text style={[styles.summaryValue, styles.bestScoreText]}>{bestScore}%</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                  Total Study Time
                </Text>
                <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
                  {totalQuizzes * 10} min
                </Text>
              </View>
            </View>

            {totalQuizzes === 0 && (
              <View style={[styles.emptyCard, isDark && styles.emptyCardDark]}>
                <AlertCircle size={48} color={isDark ? "#adb5bd" : "#6c757d"} />
                <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
                  No quiz history yet
                </Text>
                <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                  Take your first quiz to start tracking your progress!
                </Text>
              </View>
            )}

            {totalQuizzes > 0 && (
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, isDark && styles.historyTitleDark]}>
                  Quiz History
                </Text>
              </View>
            )}
          </>
        )}
        data={[...quizHistory].reverse()}
        keyExtractor={(item, index) => `quiz-${index}`}
        renderItem={({ item }) => {
          const scorePercentage = Math.round((item.score / item.totalQuestions) * 100);
          const passed = item.score >= 6;
          return (
            <View style={[styles.historyCard, isDark && styles.historyCardDark]}>
              <View style={styles.historyContent}>
                <Calendar size={20} color={isDark ? "#adb5bd" : "#6c757d"} />
                <View style={styles.historyDetails}>
                  <Text style={[styles.historyDate, isDark && styles.historyDateDark]}>
                    {formatDate(item.date)}
                  </Text>
                  <Text style={[styles.historyScore, isDark && styles.historyScoreDark]}>
                    {item.score} / {item.totalQuestions} correct
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.historyBadge,
                  passed ? styles.historyBadgePassed : styles.historyBadgeFailed,
                ]}
              >
                <Text style={styles.historyBadgeText}>{scorePercentage}%</Text>
              </View>
            </View>
          );
        }}
        ListFooterComponent={() =>
          totalQuizzes > 0 ? (
            <Pressable
              onPress={handleResetProgress}
              style={[styles.resetButton, isDark && styles.resetButtonDark]}
            >
              <RotateCcw size={20} color="#f5576c" />
              <Text style={styles.resetButtonText}>Reset All Progress</Text>
            </Pressable>
          ) : null
        }
      />
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
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
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
  statCardDark: {
    backgroundColor: "#2d3748",
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statIconPurple: {
    backgroundColor: "#667eea",
  },
  statIconBlue: {
    backgroundColor: "#4facfe",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#1a1a2e",
    marginBottom: 4,
  },
  statValueDark: {
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 4,
  },
  statLabelDark: {
    color: "#adb5bd",
  },
  statDetail: {
    fontSize: 11,
    color: "#adb5bd",
  },
  statDetailDark: {
    color: "#6c757d",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  summaryCardDark: {
    backgroundColor: "#2d3748",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "500" as const,
  },
  summaryLabelDark: {
    color: "#adb5bd",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  summaryValueDark: {
    color: "#fff",
  },
  bestScoreText: {
    color: "#43e97b",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  emptyCardDark: {
    backgroundColor: "#2d3748",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a1a2e",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTitleDark: {
    color: "#fff",
  },
  emptyText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  emptyTextDark: {
    color: "#adb5bd",
  },
  historyHeader: {
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  historyTitleDark: {
    color: "#fff",
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardDark: {
    backgroundColor: "#2d3748",
  },
  historyContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1a1a2e",
    marginBottom: 4,
  },
  historyDateDark: {
    color: "#fff",
  },
  historyScore: {
    fontSize: 12,
    color: "#6c757d",
  },
  historyScoreDark: {
    color: "#adb5bd",
  },
  historyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  historyBadgePassed: {
    backgroundColor: "#d1fae5",
  },
  historyBadgeFailed: {
    backgroundColor: "#fed7d7",
  },
  historyBadgeText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#f5576c",
  },
  resetButtonDark: {
    backgroundColor: "#2d3748",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#f5576c",
  },
});
