import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updatePageMetadata, PageMetadata, defaultMetadata } from '../utils/seo';

export const usePageMetadata = (metadata: Partial<PageMetadata> = {}) => {
  const location = useLocation();
  
  useEffect(() => {
    const fullMetadata: PageMetadata = {
      ...defaultMetadata,
      ...metadata,
      canonical: `${window.location.origin}${location.pathname}`
    };
    
    updatePageMetadata(fullMetadata);
  }, [metadata, location.pathname]);
}; 