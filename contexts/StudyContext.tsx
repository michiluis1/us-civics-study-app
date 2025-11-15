import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "@civics_study_progress";

export interface StudyProgress {
  masteredQuestions: Set<number>;
  quizHistory: {
    date: number;
    score: number;
    totalQuestions: number;
  }[];
}

export const [StudyProvider, useStudy] = createContextHook(() => {
  const [masteredQuestions, setMasteredQuestions] = useState<Set<number>>(new Set());
  const [quizHistory, setQuizHistory] = useState<{
    date: number;
    score: number;
    totalQuestions: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setMasteredQuestions(new Set(data.masteredQuestions || []));
          setQuizHistory(data.quizHistory || []);
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  const saveProgress = useCallback(async (mastered: Set<number>, history: typeof quizHistory) => {
    try {
      const data = {
        masteredQuestions: Array.from(mastered),
        quizHistory: history,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, []);

  const toggleMastered = useCallback((questionId: number) => {
    const newMastered = new Set(masteredQuestions);
    if (newMastered.has(questionId)) {
      newMastered.delete(questionId);
    } else {
      newMastered.add(questionId);
    }
    setMasteredQuestions(newMastered);
    saveProgress(newMastered, quizHistory);
  }, [masteredQuestions, quizHistory, saveProgress]);

  const addQuizResult = useCallback((score: number, totalQuestions: number) => {
    const newHistory = [
      ...quizHistory,
      {
        date: Date.now(),
        score,
        totalQuestions,
      },
    ];
    setQuizHistory(newHistory);
    saveProgress(masteredQuestions, newHistory);
  }, [masteredQuestions, quizHistory, saveProgress]);

  const resetProgress = useCallback(async () => {
    setMasteredQuestions(new Set());
    setQuizHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return useMemo(() => ({
    masteredQuestions,
    quizHistory,
    isLoading,
    toggleMastered,
    addQuizResult,
    resetProgress,
  }), [masteredQuestions, quizHistory, isLoading, toggleMastered, addQuizResult, resetProgress]);
});
