import React from 'react';
import { cn } from '../../design-system/utils/classNames';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  background?: 'white' | 'gray' | 'transparent';
  id?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  padding = 'md',
  maxWidth = 'full',
  background = 'white',
  id
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent',
  };

  return (
    <section
      id={id}
      className={cn(
        'w-full',
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
    >
      <div className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        maxWidth !== 'full' && maxWidthClasses[maxWidth]
      )}>
        {children}
      </div>
    </section>
  );
};

export { Section };
