import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 20) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    setDisplayedText('');
    
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);
    
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return { displayedText, isTyping };
}
