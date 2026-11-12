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
      className={`inline-block relative overflow-hidden font-semibold ${className}`}
    >
      <span className=" text-accent">
        {text}
      </span>
      {!disabled && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ animationDuration: `${speed}s` }}
        />
      )}
    </span>
  );
};
