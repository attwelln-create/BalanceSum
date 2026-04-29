
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { generateMathProblem, type GenerateMathProblemOutput } from '@/ai/flows/generate-math-problem';
import { useGameProgress, type Difficulty } from '@/lib/game-state';
import { playSuccessSound, playPopSound } from '@/lib/sounds';
import { Seesaw } from './Seesaw';
import { Ball } from './Ball';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Star, Trophy, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GameContainer = () => {
  const { progress, updateProgress } = useGameProgress();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [problem, setProblem] = useState<GenerateMathProblemOutput | null>(null);
  const [userBalls, setUserBalls] = useState<{ id: string; value: number }[]>([]);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState('¡Logra el equilibrio!');

  const currentSum = userBalls.reduce((acc, b) => acc + b.value, 0);

  const fetchProblem = useCallback(async (diff: Difficulty) => {
    setLoading(true);
    setError(false);
    setSolved(false);
    setUserBalls([]);
    setMessage('¡Logra el equilibrio!');
    try {
      const p = await generateMathProblem({ difficultyLevel: diff });
      if (p) {
        setProblem(p);
      } else {
        throw new Error('No problem generated');
      }
    } catch (err) {
      console.error('Error fetching problem:', err);
      setError(true);
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (progress && !problem && !loading && !error) {
      fetchProblem(progress.currentLevel);
    }
  }, [progress, problem, loading, error, fetchProblem]);

  useEffect(() => {
    if (problem && currentSum === problem.targetNumber && !solved) {
      handleWin();
    } else if (problem && currentSum > problem.targetNumber) {
      setMessage('¡Ups! Te pasaste.');
    } else if (problem && currentSum < problem.targetNumber && userBalls.length > 0) {
      setMessage('¡Casi! Sigue sumando.');
    }
  }, [currentSum, problem, userBalls.length, solved]);

  const handleWin = async () => {
    setSolved(true);
    setMessage('¡BIEN HECHO! ✨');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#43C138', '#B6FF2D', '#ffffff']
    });
    playSuccessSound();
    
    if (progress) {
      updateProgress({
        completedProblems: progress.completedProblems + 1,
        totalScore: progress.totalScore + (progress.currentLevel * 10)
      });
    }
  };

  const addBall = (value: number) => {
    if (solved || loading) return;
    playPopSound();
    setUserBalls([...userBalls, { id: Math.random().toString(36).substr(2, 9), value }]);
  };

  const removeBall = (id: string) => {
    if (solved || loading) return;
    setUserBalls(userBalls.filter(b => b.id !== id));
  };

  const nextProblem = () => {
    if (progress) {
      fetchProblem(progress.currentLevel);
    }
  };

  const changeLevel = (l: Difficulty) => {
    if (loading) return;
    updateProgress({ currentLevel: l });
    fetchProblem(l);
  };

  if (!progress) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 flex flex-col min-h-screen">
      {/* Header - Much more compact */}
      <div className="flex items-center justify-between mb-2 bg-white/50 p-2 rounded-xl border-2 border-primary/10 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-black text-primary flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-accent" />
            BalanceSum
          </h1>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Aprende Sumando</p>
        </div>
        
        <div className="flex gap-1">
          {[1, 2, 3].map((l) => (
            <Button
              key={l}
              variant={progress.currentLevel === l ? "default" : "outline"}
              size="sm"
              disabled={loading}
              onClick={() => changeLevel(l as Difficulty)}
              className={cn(
                "rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0 font-bold text-xs sm:text-sm border-2",
                progress.currentLevel === l ? "bg-primary shadow-md" : "hover:bg-accent/10"
              )}
            >
              {l}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Game Area - Reduced padding and relative sizing */}
      <Card className="flex-1 min-h-[350px] bg-white/40 border-4 border-primary/5 rounded-[1.5rem] shadow-lg relative overflow-hidden p-2 sm:p-4 flex flex-col items-center justify-between">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-bold text-primary text-sm">Cargando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center py-20">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <Button 
              onClick={() => fetchProblem(progress.currentLevel)}
              size="sm"
              className="rounded-full gap-2 font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              Reintentar
            </Button>
          </div>
        ) : problem ? (
          <div className="w-full flex flex-col items-center flex-1">
            <div className="text-center mb-1 mt-1">
              <h2 className={cn(
                "text-lg sm:text-xl font-black transition-all",
                solved ? "text-accent scale-105" : "text-primary"
              )}>
                {message}
              </h2>
            </div>

            <Seesaw 
              target={problem.targetNumber} 
              currentSum={currentSum} 
              rightBalls={userBalls} 
              onRemoveBall={removeBall}
            />

            {/* Controls - Even more compact for tablet */}
            <div className="w-full max-w-sm bg-white/80 p-3 sm:p-4 rounded-2xl border-2 border-primary/10 shadow-md mb-2">
              <div className="flex justify-center gap-2 flex-wrap mb-3">
                {problem.ballValues.map((val) => (
                  <Ball 
                    key={val} 
                    value={val} 
                    variant="button" 
                    onClick={() => addBall(val)} 
                    className="w-12 h-12 sm:w-14 sm:h-14"
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setUserBalls([])}
                  disabled={solved || userBalls.length === 0}
                  className="rounded-full gap-1.5 font-bold text-muted-foreground h-8"
                >
                  <RotateCcw className="w-3.3 h-3.5" />
                  Limpiar
                </Button>
                
                {solved && (
                  <Button 
                    variant="default" 
                    size="default" 
                    onClick={nextProblem}
                    className="rounded-full gap-2 font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow animate-bounce h-9"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Button onClick={() => fetchProblem(progress.currentLevel)} className="rounded-full font-bold px-6 py-2 text-lg">
              ¡Comenzar!
            </Button>
          </div>
        )}
      </Card>

      {/* Footer Stats - Compacted */}
      <div className="mt-2 mb-2 flex justify-center gap-4 px-2">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <p className="text-sm font-black text-primary">{progress.completedProblems}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-accent" />
          <p className="text-sm font-black text-primary">{progress.totalScore}</p>
        </div>
      </div>
    </div>
  );
};
