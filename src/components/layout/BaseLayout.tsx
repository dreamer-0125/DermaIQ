import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  className = '',
  showHeader = true,
  showFooter = true,
  maxWidth = 'full'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      {showHeader && <Header />}
      <main className={`flex-1 ${maxWidth !== 'full' ? `${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8` : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export { BaseLayout }; 