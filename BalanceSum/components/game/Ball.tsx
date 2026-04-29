
'use client';

import { cn } from "@/lib/utils";

interface BallProps {
  value: number;
  className?: string;
  onClick?: () => void;
  variant?: 'large' | 'small' | 'button';
  isRemoving?: boolean;
}

export const Ball = ({ value, className, onClick, variant = 'small', isRemoving }: BallProps) => {
  const getSize = () => {
    if (variant === 'large') return 'w-24 h-24 text-2xl';
    if (variant === 'button') return 'w-16 h-16 text-lg active:scale-95 transition-transform';
    return 'w-12 h-12 text-sm';
  };

  const getColor = () => {
    if (value >= 50) return 'bg-purple-500 border-purple-700 shadow-[inset_-4px_-4px_rgba(0,0,0,0.2)]';
    if (value >= 20) return 'bg-orange-500 border-orange-700 shadow-[inset_-4px_-4px_rgba(0,0,0,0.2)]';
    if (value >= 10) return 'bg-blue-500 border-blue-700 shadow-[inset_-4px_-4px_rgba(0,0,0,0.2)]';
    if (value >= 5) return 'bg-red-500 border-red-700 shadow-[inset_-4px_-4px_rgba(0,0,0,0.2)]';
    return 'bg-yellow-400 border-yellow-600 shadow-[inset_-4px_-4px_rgba(0,0,0,0.1)]';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-full border-4 flex items-center justify-center font-bold text-white shadow-lg cursor-pointer select-none ball-bounce",
        getSize(),
        getColor(),
        isRemoving && "animate-out fade-out zoom-out-50 duration-200",
        className
      )}
    >
      {value}
      <div className="absolute top-1 left-2 w-1/4 h-1/4 bg-white/30 rounded-full blur-[1px]" />
    </div>
  );
};
