import { useEffect, useState } from 'react';

export function useTypingEffect(text: string, speed = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsDone(true);
    }
  }, [currentIndex, speed, text]);

  return { displayedText, isDone };
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// For smooth fade-in animations
export function useFadeIn(delay = 0) {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return { opacity, transition: `opacity 0.5s ease` };
}
