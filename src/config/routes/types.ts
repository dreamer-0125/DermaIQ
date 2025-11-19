import React from 'react';

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title?: string;
  description?: string;
  category?: 'main' | 'solutions' | 'services' | 'legal' | 'demo';
}
