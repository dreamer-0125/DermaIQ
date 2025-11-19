import { colors, spacing, typography, borderRadius, shadows, breakpoints } from './tokens';

// Utility functions for design system
export const createColorPalette = (baseColor: keyof typeof colors) => {
  return Object.entries(colors[baseColor]).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
};

export const getSpacing = (size: keyof typeof spacing) => spacing[size];

export const getTypography = (size: keyof typeof typography.fontSize) => {
  const [fontSize, lineHeight] = typography.fontSize[size];
  return { fontSize, lineHeight };
};

export const getBorderRadius = (size: keyof typeof borderRadius) => borderRadius[size];

export const getShadow = (size: keyof typeof shadows) => shadows[size];

// CSS-in-JS utilities
export const createResponsiveValue = <T>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}) => {
  const breakpointKeys = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
  const mediaQueries = breakpointKeys.map(bp => 
    values[bp] ? `@media (min-width: ${breakpoints[bp]}) { ${values[bp]} }` : ''
  ).filter(Boolean);
  
  return `${values.base} ${mediaQueries.join(' ')}`;
};

// Color utilities
export const getContrastColor = (backgroundColor: string): 'white' | 'black' => {
  // Simple contrast calculation - in a real app, you'd use a more sophisticated algorithm
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
