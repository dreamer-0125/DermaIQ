import React from 'react';

interface FaviconIconProps {
  className?: string;
  alt?: string;
}

const FaviconIcon: React.FC<FaviconIconProps> = ({
  className = "h-12 w-auto",
  alt = "DermaIQ"
}) => (
  <img
    src="/favicon.ico"
    alt={alt}
    className={className}
  />
);

export default FaviconIcon;
