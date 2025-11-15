import { Star } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { CIVICS_QUESTIONS } from "../constants/civicsQuestions";
import { useStudy } from "../contexts/StudyContext";

export default function AllQuestionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { masteredQuestions, toggleMastered } = useStudy();

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return CIVICS_QUESTIONS;

    const query = searchQuery.toLowerCase();
    return CIVICS_QUESTIONS.filter(
      (q) =>
        q.question.toLowerCase().includes(query) ||
        q.answers.some((a) => a.toLowerCase().includes(query)) ||
        q.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            isDark && styles.searchInputDark,
          ]}
          placeholder="Search questions..."
          placeholderTextColor={isDark ? "#adb5bd" : "#6c757d"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isMastered = masteredQuestions.has(item.id);
          return (
            <View style={[styles.questionCard, isDark && styles.questionCardDark]}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={[styles.numberText, isDark && styles.numberTextDark]}>
                    {item.id}
                  </Text>
                </View>
                <Pressable
                  onPress={() => toggleMastered(item.id)}
                  style={styles.starButton}
                  hitSlop={8}
                >
                  <Star
                    size={24}
                    color={isMastered ? "#fbbf24" : isDark ? "#6c757d" : "#adb5bd"}
                    fill={isMastered ? "#fbbf24" : "transparent"}
                  />
                </Pressable>
              </View>

              <Text style={[styles.questionText, isDark && styles.questionTextDark]}>
                {item.question}
              </Text>

              <View style={styles.answersContainer}>
                {item.answers.map((answer, index) => (
                  <View key={index} style={styles.answerRow}>
                    <Text style={[styles.bullet, isDark && styles.bulletDark]}>•</Text>
                    <Text style={[styles.answerText, isDark && styles.answerTextDark]}>
                      {answer}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <Text style={[styles.categoryText, isDark && styles.categoryTextDark]}>
                  {item.category}
                </Text>
                {item.isFor65Plus && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>65+</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              No questions found
            </Text>
          </View>
        )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  searchInput: {
    height: 48,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a1a2e",
  },
  searchInputDark: {
    backgroundColor: "#2d3748",
    color: "#fff",
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionCardDark: {
    backgroundColor: "#2d3748",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#fff",
    fontWeight: "700" as const,
    fontSize: 14,
  },
  numberTextDark: {
    color: "#fff",
  },
  starButton: {
    padding: 4,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1a1a2e",
    marginBottom: 12,
    lineHeight: 24,
  },
  questionTextDark: {
    color: "#fff",
  },
  answersContainer: {
    marginBottom: 12,
    gap: 6,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 16,
    color: "#667eea",
    marginRight: 8,
    marginTop: 2,
  },
  bulletDark: {
    color: "#a78bfa",
  },
  answerText: {
    flex: 1,
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  answerTextDark: {
    color: "#cbd5e0",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500" as const,
  },
  categoryTextDark: {
    color: "#adb5bd",
  },
  badge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
  },
  emptyTextDark: {
    color: "#adb5bd",
  },
});
