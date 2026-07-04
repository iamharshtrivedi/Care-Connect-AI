import React from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function TypewriterText({ text, speed = 15, className = "" }) {
  const { displayedText, isTyping } = useTypewriter(text, speed);
  
  return (
    <span className={className}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-current animate-pulse opacity-70" />
      )}
    </span>
  );
}
