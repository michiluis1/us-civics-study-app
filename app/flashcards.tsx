import { ChevronLeft, ChevronRight, RotateCw, Star } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { CivicsQuestion, CIVICS_QUESTIONS } from "../constants/civicsQuestions";
import { useStudy } from "../contexts/StudyContext";

export default function FlashcardsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flipAnimation] = useState<Animated.Value>(new Animated.Value(0));
  const { masteredQuestions, toggleMastered } = useStudy();

  const currentQuestion: CivicsQuestion = CIVICS_QUESTIONS[currentIndex];
  const isMastered = masteredQuestions.has(currentQuestion.id);

  const flipCard = useCallback(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  }, [isFlipped, flipAnimation]);

  const nextCard = useCallback(() => {
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setCurrentIndex((prev) => (prev + 1) % CIVICS_QUESTIONS.length);
  }, [flipAnimation]);

  const prevCard = useCallback(() => {
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setCurrentIndex((prev) => (prev - 1 + CIVICS_QUESTIONS.length) % CIVICS_QUESTIONS.length);
  }, [flipAnimation]);

  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.counter, isDark && styles.counterDark]}>
            {currentIndex + 1} / {CIVICS_QUESTIONS.length}
          </Text>
          <Pressable
            onPress={() => toggleMastered(currentQuestion.id)}
            style={styles.starButton}
            hitSlop={8}
          >
            <Star
              size={28}
              color={isMastered ? "#fbbf24" : isDark ? "#6c757d" : "#adb5bd"}
              fill={isMastered ? "#fbbf24" : "transparent"}
            />
          </Pressable>
        </View>

        <Pressable onPress={flipCard} style={styles.cardContainer}>
          {!isFlipped ? (
            <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                isDark && styles.cardDark,
                { transform: [{ rotateY: frontRotation }] },
              ]}
            >
              <Text style={[styles.label, styles.questionLabel]}>QUESTION</Text>
              <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                {currentQuestion.question}
              </Text>
              <View style={styles.tapHint}>
                <RotateCw size={20} color={isDark ? "#a78bfa" : "#667eea"} />
                <Text style={[styles.tapHintText, isDark && styles.tapHintTextDark]}>
                  Tap to reveal answer
                </Text>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                isDark && styles.cardDark,
                { transform: [{ rotateY: backRotation }] },
              ]}
            >
              <Text style={[styles.label, styles.answerLabel]}>ANSWER</Text>
              <View style={styles.answersContainer}>
                {currentQuestion.answers.map((answer, index) => (
                  <View key={index} style={styles.answerRow}>
                    <Text style={[styles.bullet, isDark && styles.bulletDark]}>•</Text>
                    <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                      {answer}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </Pressable>

        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, isDark && styles.categoryTextDark]}>
            {currentQuestion.category}
          </Text>
          {currentQuestion.isFor65Plus && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>65+</Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={prevCard}
            style={[styles.controlButton, isDark && styles.controlButtonDark]}
          >
            <ChevronLeft size={24} color={isDark ? "#fff" : "#1a1a2e"} />
            <Text style={[styles.controlText, isDark && styles.controlTextDark]}>Previous</Text>
          </Pressable>

          <Pressable
            onPress={nextCard}
            style={[styles.controlButton, isDark && styles.controlButtonDark]}
          >
            <Text style={[styles.controlText, isDark && styles.controlTextDark]}>Next</Text>
            <ChevronRight size={24} color={isDark ? "#fff" : "#1a1a2e"} />
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  counter: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  counterDark: {
    color: "#fff",
  },
  starButton: {
    padding: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    minHeight: 400,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    backfaceVisibility: "hidden",
  },
  cardDark: {
    backgroundColor: "#2d3748",
  },
  cardFront: {},
  cardBack: {},
  label: {
    fontSize: 12,
    fontWeight: "800" as const,
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: "center",
  },
  questionLabel: {
    color: "#667eea",
  },
  answerLabel: {
    color: "#f093fb",
  },
  cardText: {
    fontSize: 20,
    lineHeight: 32,
    color: "#1a1a2e",
    textAlign: "center",
  },
  cardTextDark: {
    color: "#fff",
  },
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  tapHintText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600" as const,
  },
  tapHintTextDark: {
    color: "#a78bfa",
  },
  answersContainer: {
    gap: 12,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 20,
    color: "#f093fb",
    marginRight: 12,
    marginTop: 4,
  },
  bulletDark: {
    color: "#f093fb",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500" as const,
  },
  categoryTextDark: {
    color: "#adb5bd",
  },
  badge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#1a1a2e",
  },
  controls: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  controlButtonDark: {
    backgroundColor: "#2d3748",
  },
  controlText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1a1a2e",
  },
  controlTextDark: {
    color: "#fff",
  },
});
