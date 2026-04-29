
'use client';

import { useState, useEffect } from 'react';

export type Difficulty = 1 | 2 | 3;

export interface GameProgress {
  currentLevel: Difficulty;
  completedProblems: number;
  totalScore: number;
}

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('balancesum_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    } else {
      const initial: GameProgress = {
        currentLevel: 1,
        completedProblems: 0,
        totalScore: 0,
      };
      setProgress(initial);
      localStorage.setItem('balancesum_progress', JSON.stringify(initial));
    }
  }, []);

  const updateProgress = (updates: Partial<GameProgress>) => {
    if (!progress) return;
    const next = { ...progress, ...updates };
    setProgress(next);
    localStorage.setItem('balancesum_progress', JSON.stringify(next));
  };

  return { progress, updateProgress };
};
