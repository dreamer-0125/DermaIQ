import React from 'react';
import { Link } from 'react-router-dom';
import { handleAnchorClick } from '../../../utils/scrollUtils';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  href, 
  children, 
  className = "hover:text-black transition-colors text-sm" 
}) => {
  // Handle anchor links (starting with #)
  if (href.startsWith('#')) {
    return (
      <a
        href={href}
        onClick={(e) => handleAnchorClick(e, href.substring(1))}
        className={className}
      >
        {children}
      </a>
    );
  }

  // Handle external links
  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  // Handle internal links
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
};

export { FooterLink };
