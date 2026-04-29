
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Ball } from './Ball';

interface SeesawProps {
  target: number;
  currentSum: number;
  rightBalls: { id: string; value: number }[];
  onRemoveBall: (id: string) => void;
}

export const Seesaw = ({ target, currentSum, rightBalls, onRemoveBall }: SeesawProps) => {
  const getTiltAngle = () => {
    if (currentSum === target) return 0;
    const diff = currentSum - target;
    const angle = Math.max(-15, Math.min(15, diff * 1.5));
    return angle;
  };

  const tiltAngle = getTiltAngle();

  return (
    <div className="relative w-full h-48 sm:h-56 flex items-end justify-center perspective-1000 mt-2 mb-8">
      {/* Base/Pivot */}
      <div className="absolute bottom-0 z-0 w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-t-full border-x-4 border-t-4 border-primary-foreground/20" />

      {/* The Plank */}
      <div 
        className="relative w-[85%] h-3 sm:h-4 bg-accent border-2 border-accent-foreground/20 rounded-full seesaw-transition origin-center z-10"
        style={{ transform: `rotate(${tiltAngle}deg)` }}
      >
        {/* Left Side (Target) */}
        <div className="absolute left-1/4 bottom-full mb-1 -translate-x-1/2 flex flex-col items-center">
          <Ball value={target} variant="small" className="mb-1 scale-110 sm:scale-125 bg-primary border-primary-foreground/30 shadow-none" />
          <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[7px] font-black tracking-tighter uppercase">
            META
          </span>
        </div>

        {/* Right Side (User Sum) */}
        <div className="absolute right-1/4 bottom-full mb-1 translate-x-1/2 flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
          <div className="flex flex-wrap-reverse gap-0.5 justify-center max-w-[120px] max-h-[140px] overflow-visible mb-1">
            {rightBalls.map((ball) => (
              <Ball 
                key={ball.id} 
                value={ball.value} 
                variant="small" 
                onClick={() => onRemoveBall(ball.id)}
                className="scale-75 sm:scale-90"
              />
            ))}
            {rightBalls.length === 0 && (
              <div className="w-8 h-8 border-2 border-dashed border-accent-foreground/30 rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className={cn(
              "px-3 py-0.5 rounded-full text-sm sm:text-base font-black border-2 transition-all",
              currentSum === target ? "bg-accent text-accent-foreground border-accent-foreground shadow-sm scale-105" : "bg-white text-muted-foreground border-muted shadow-sm"
            )}>
              {currentSum}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
