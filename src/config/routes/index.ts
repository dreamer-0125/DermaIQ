// Route Types
export type { RouteConfig } from './types';

// Route Collections
export { mainRoutes } from './mainRoutes';
export { businessRoutes } from './businessRoutes';
export { legalRoutes } from './legalRoutes';
export { demoRoutes } from './demoRoutes';

// Route Utilities
export { 
  allRoutes,
  getRoutesByCategory, 
  getRouteByPath,
  getPublicRoutes,
  getProtectedRoutes
} from './utils';

// Default routes export for App.tsx
export { allRoutes as routes } from './utils';
