'use client';

import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  return (
    <span
      className={`inline-block relative overflow-hidden font-extrabold ${className}`}
    >
      <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
        {text}
      </span>
      {!disabled && (
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none"
          style={{ animationDuration: `${speed}s` }}
        />
      )}
    </span>
  );
};
