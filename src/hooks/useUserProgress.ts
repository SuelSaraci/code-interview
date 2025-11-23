import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const defaultProgress: UserProgress = {
  questionsCompleted: [],
  freeQuestionsUsed: 0,
  hasUnlocked: false,
  accuracy: {},
  languageStats: {},
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userProgress');
      return stored ? JSON.parse(stored) : defaultProgress;
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }, [progress]);

  const completeQuestion = (questionId: string, isFree: boolean) => {
    setProgress(prev => {
      const newCompleted = prev.questionsCompleted.includes(questionId)
        ? prev.questionsCompleted
        : [...prev.questionsCompleted, questionId];
      
      const newFreeUsed = isFree && !prev.questionsCompleted.includes(questionId)
        ? prev.freeQuestionsUsed + 1
        : prev.freeQuestionsUsed;

      return {
        ...prev,
        questionsCompleted: newCompleted,
        freeQuestionsUsed: newFreeUsed,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
    });
  };

  const unlockAll = () => {
    setProgress(prev => ({
      ...prev,
      hasUnlocked: true
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem('userProgress');
  };

  const canAccessQuestion = (isFree: boolean): boolean => {
    return isFree || progress.hasUnlocked;
  };

  const shouldShowPaywall = (isFree: boolean): boolean => {
    return !isFree && !progress.hasUnlocked && progress.freeQuestionsUsed >= 3;
  };

  return {
    progress,
    completeQuestion,
    unlockAll,
    resetProgress,
    canAccessQuestion,
    shouldShowPaywall
  };
}
