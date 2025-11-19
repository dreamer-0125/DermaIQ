// Animation utility functions for consistent and random animations across the website

// List of available animations from the specification
export const availableAnimations = [
  'animate-fadeIn',
  'animate-fadeOut', 
  'animate-slideInLeft',
  'animate-slideOutRight',
  'animate-zoomIn',
  'animate-zoomOut',
  'animate-tada',
  'animate-flash',
  'animate-jiggle',
  'animate-shake',
  'animate-wiggle',
  'animate-flip',
  'animate-glow'
] as const;

export type AnimationType = typeof availableAnimations[number];

// List of available card hover effects
export const availableCardHovers = [
  'card-hover-scale',
  'card-hover-lift', 
  'card-hover-rotate',
  'card-hover-glow'
] as const;

export type CardHoverType = typeof availableCardHovers[number];

// Function to get a random animation
export const getRandomAnimation = (): AnimationType => {
  const randomIndex = Math.floor(Math.random() * availableAnimations.length);
  return availableAnimations[randomIndex];
};

// Function to get a random card hover effect
export const getRandomCardHover = (): CardHoverType => {
  const randomIndex = Math.floor(Math.random() * availableCardHovers.length);
  return availableCardHovers[randomIndex];
};

// Function to get multiple random animations for a group of elements
export const getRandomAnimations = (count: number): AnimationType[] => {
  const animations: AnimationType[] = [];
  const available = [...availableAnimations];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    animations.push(available[randomIndex]);
    available.splice(randomIndex, 1); // Remove used animation to avoid duplicates
  }
  
  return animations;
};

// Function to get multiple random card hover effects for a group of cards
export const getRandomCardHovers = (count: number): CardHoverType[] => {
  const hovers: CardHoverType[] = [];
  const available = [...availableCardHovers];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    hovers.push(available[randomIndex]);
    available.splice(randomIndex, 1); // Remove used hover to avoid duplicates
  }
  
  return hovers;
};

// Function to get consistent animations for elements in the same container
export const getContainerAnimations = (containerId: string, elementCount: number): AnimationType[] => {
  // Use container ID to generate consistent animations for elements in the same container
  const hash = containerId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const animations: AnimationType[] = [];
  for (let i = 0; i < elementCount; i++) {
    const index = (hash + i) % availableAnimations.length;
    animations.push(availableAnimations[index]);
  }
  
  return animations;
};

// Function to get consistent card hover effects for cards in the same container
export const getContainerCardHovers = (containerId: string, cardCount: number): CardHoverType[] => {
  // Use container ID to generate consistent hover effects for cards in the same container
  const hash = containerId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const hovers: CardHoverType[] = [];
  for (let i = 0; i < cardCount; i++) {
    const index = (hash + i) % availableCardHovers.length;
    hovers.push(availableCardHovers[index]);
  }
  
  return hovers;
};

// Function to apply animation when element is in viewport
export const getIntersectionObserverAnimation = (
  animation: AnimationType,
  threshold: number = 0.1,
  rootMargin: string = '0px 0px -50px 0px'
) => {
  return {
    threshold,
    rootMargin,
    triggerOnce: true,
    className: animation
  };
};

// Predefined animation combinations for common use cases
export const animationPresets = {
  hero: ['animate-fadeIn', 'animate-slideInLeft', 'animate-zoomIn'],
  features: ['animate-fadeIn', 'animate-slideInLeft', 'animate-tada'],
  cards: ['animate-fadeIn', 'animate-zoomIn', 'animate-slideInLeft'],
  text: ['animate-fadeIn', 'animate-slideInLeft'],
  icons: ['animate-tada', 'animate-glow', 'animate-wiggle']
} as const;
