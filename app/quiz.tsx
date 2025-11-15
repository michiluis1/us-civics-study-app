import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { CivicsQuestion, CIVICS_QUESTIONS } from "../constants/civicsQuestions";
import { useStudy } from "../contexts/StudyContext";

interface QuizQuestion {
  question: CivicsQuestion;
  options: string[];
  correctAnswer: string;
}

export default function QuizScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { addQuizResult } = useStudy();

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...CIVICS_QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    const quiz: QuizQuestion[] = selected.map((q) => {
      const correctAnswer = q.answers[0];
      const wrongAnswers = CIVICS_QUESTIONS.filter(
        (other) => other.id !== q.id && other.category === q.category
      )
        .flatMap((other) => other.answers)
        .filter((a) => !q.answers.includes(a))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        question: q,
        options,
        correctAnswer,
      };
    });

    setQuizQuestions(quiz);
    setUserAnswers(new Array(10).fill(null));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
  }, []);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const handleSelectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);

  const handleNext = useCallback(() => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(newAnswers[currentQuestionIndex + 1]);
    } else {
      const score = newAnswers.filter(
        (answer, index) => answer === quizQuestions[index].correctAnswer
      ).length;
      addQuizResult(score, quizQuestions.length);
      router.replace({
        pathname: "/quiz-results",
        params: { score: score.toString(), total: quizQuestions.length.toString() },
      });
    }
  }, [currentQuestionIndex, selectedAnswer, userAnswers, quizQuestions, addQuizResult, router]);

  const currentQuiz = useMemo(
    () => (quizQuestions.length > 0 ? quizQuestions[currentQuestionIndex] : null),
    [quizQuestions, currentQuestionIndex]
  );

  if (!currentQuiz) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Loading quiz...
          </Text>
        </View>
      </View>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.questionCard, isDark && styles.questionCardDark]}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>{currentQuestionIndex + 1}</Text>
          </View>
          <Text style={[styles.questionText, isDark && styles.questionTextDark]}>
            {currentQuiz.question.question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuiz.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            return (
              <Pressable
                key={index}
                onPress={() => handleSelectAnswer(option)}
                style={[
                  styles.optionButton,
                  isDark && styles.optionButtonDark,
                  isSelected && styles.optionButtonSelected,
                  isSelected && isDark && styles.optionButtonSelectedDark,
                ]}
              >
                <View
                  style={[
                    styles.optionRadio,
                    isDark && styles.optionRadioDark,
                    isSelected && styles.optionRadioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.optionRadioInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isDark && styles.optionTextDark,
                    isSelected && styles.optionTextSelected,
                    isSelected && isDark && styles.optionTextSelectedDark,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          disabled={!selectedAnswer}
          style={[
            styles.nextButton,
            !selectedAnswer && styles.nextButtonDisabled,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Text>
        </Pressable>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#6c757d",
  },
  loadingTextDark: {
    color: "#adb5bd",
  },
  progressBarContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4facfe",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1a1a2e",
    textAlign: "center",
  },
  progressTextDark: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  questionCardDark: {
    backgroundColor: "#2d3748",
  },
  questionNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4facfe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  questionNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#1a1a2e",
    fontWeight: "600" as const,
  },
  questionTextDark: {
    color: "#fff",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  optionButtonDark: {
    backgroundColor: "#2d3748",
    borderColor: "#4a5568",
  },
  optionButtonSelected: {
    borderColor: "#4facfe",
    backgroundColor: "#e8f4ff",
  },
  optionButtonSelectedDark: {
    borderColor: "#4facfe",
    backgroundColor: "#1e3a5f",
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ced4da",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioDark: {
    borderColor: "#6c757d",
  },
  optionRadioSelected: {
    borderColor: "#4facfe",
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4facfe",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#495057",
    lineHeight: 24,
  },
  optionTextDark: {
    color: "#cbd5e0",
  },
  optionTextSelected: {
    color: "#1a1a2e",
    fontWeight: "600" as const,
  },
  optionTextSelectedDark: {
    color: "#fff",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  nextButton: {
    backgroundColor: "#4facfe",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: "#ced4da",
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700" as const,
  },
});
