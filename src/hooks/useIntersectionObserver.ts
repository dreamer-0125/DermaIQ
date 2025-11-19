import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce && !hasTriggered) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isIntersecting, hasTriggered };
};

// Hook specifically for animations
export const useAnimationOnScroll = (
  animationClass: string,
  options: UseIntersectionObserverOptions = {}
) => {
  const { elementRef, isIntersecting } = useIntersectionObserver(options);
  
  return {
    elementRef,
    className: isIntersecting ? animationClass : 'opacity-0'
  };
};

// Hook for staggered animations in a list
export const useStaggeredAnimations = (
  animationClasses: string[],
  staggerDelay: number = 200,
  options: UseIntersectionObserverOptions = {}
) => {
  const { elementRef, isIntersecting } = useIntersectionObserver(options);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (isIntersecting && visibleItems.length === 0) {
      const timers: NodeJS.Timeout[] = [];
      
      animationClasses.forEach((_, index) => {
        const timer = setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * staggerDelay);
        
        timers.push(timer);
      });

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isIntersecting, animationClasses, staggerDelay, visibleItems.length]);

  const getItemClassName = (index: number) => {
    if (visibleItems.includes(index)) {
      return animationClasses[index] || 'animate-fadeIn';
    }
    return 'opacity-0';
  };

  return {
    elementRef,
    getItemClassName,
    visibleItems
  };
};
