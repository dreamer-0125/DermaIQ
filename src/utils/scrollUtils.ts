/**
 * Smooth scroll to a specific element by ID
 */
export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Smooth scroll to top of the page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Handle anchor link clicks with smooth scrolling
 */
export const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string, offset: number = 80) => {
  e.preventDefault();
  scrollToElement(elementId, offset);
}; 