import { RouteConfig } from './types';
import { mainRoutes } from './mainRoutes';
import { businessRoutes } from './businessRoutes';
import { legalRoutes } from './legalRoutes';
import { demoRoutes } from './demoRoutes';

// Combine all routes
export const allRoutes: RouteConfig[] = [
  ...mainRoutes,
  ...businessRoutes,
  ...legalRoutes,
  ...demoRoutes
];

export const getRoutesByCategory = (category: string): RouteConfig[] => {
  return allRoutes.filter(route => route.category === category);
};

export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return allRoutes.find(route => route.path === path);
};

export const getPublicRoutes = (): RouteConfig[] => {
  return allRoutes.filter(route => 
    !route.path.startsWith('/demo') &&
    !route.path.startsWith('/dermaiq')
  );
};

export const getProtectedRoutes = (): RouteConfig[] => {
  return allRoutes.filter(route => 
    route.path.startsWith('/demo') ||
    route.path.startsWith('/dermaiq')
  );
};
