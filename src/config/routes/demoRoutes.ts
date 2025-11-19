import { RouteConfig } from './types';
import { 
  Dashboard,
  ConsultantServices, 
  TreatmentPlan,
  Profile,
  Upload,
  Result,
  Tools,
  About,
  Donation,
  Marketplace
} from '../../demo/pages';

export const demoRoutes: RouteConfig[] = [
  // Demo Routes - Individual pages with specific functionality
  {
    path: '/demo',
    element: Dashboard,
    title: 'DermaIQ Platform Demo',
    description: 'Main dashboard with overview and quick actions',
    category: 'demo'
  },
  {
    path: '/demo/profile',
    element: Profile,
    title: 'Profile',
    description: 'User profile management and settings',
    category: 'demo'
  },
  {
    path: '/demo/dashboard',
    element: Dashboard,
    title: 'Dashboard',
    description: 'Main dashboard with overview and quick actions',
    category: 'demo'
  },
  {
    path: '/demo/upload',
    element: Upload,
    title: 'Upload',
    description: 'Upload wound images for AI analysis',
    category: 'demo'
  },
  {
    path: '/demo/result',
    element: Result,
    title: 'Results',
    description: 'View analysis results and treatment recommendations',
    category: 'demo'
  },
  {
    path: '/demo/result/:threadId',
    element: Result,
    title: 'Result Details',
    description: 'View detailed analysis result',
    category: 'demo'
  },
  {
    path: '/demo/treatment',
    element: TreatmentPlan,
    title: 'Treatment Plan',
    description: 'AI-generated treatment recommendations',
    category: 'demo'
  },
  {
    path: '/demo/consultant',
    element: ConsultantServices,
    title: 'Consultant Services',
    description: 'Find specialists for wound care needs',
    category: 'demo'
  },
  {
    path: '/demo/consultant/:threadId',
    element: ConsultantServices,
    title: 'Consultant Services Details',
    description: 'View doctor recommendations for specific analysis',
    category: 'demo'
  },
  {
    path: '/demo/marketplace',
    element: Marketplace,
    title: 'Marketplace',
    description: 'Shop for medical supplies and wound care products',
    category: 'demo'
  },
  {
    path: '/demo/tools',
    element: Tools,
    title: 'Tools',
    description: 'Access powerful tools and utilities',
    category: 'demo'
  },
  {
    path: '/demo/about',
    element: About,
    title: 'About',
    description: 'Learn about DermaIQ and our mission',
    category: 'demo'
  },
  {
    path: '/demo/donation',
    element: Donation,
    title: 'Donation',
    description: 'Support our mission with a donation',
    category: 'demo'
  },
  // Legacy routes for backward compatibility (with threadId support)
  {
    path: '/demo/consultant/:threadId',
    element: ConsultantServices,
    title: 'Consultant Services',
    description: 'Find specialists for wound care needs',
    category: 'demo'
  },
  {
    path: '/demo/treatment/:threadId',
    element: TreatmentPlan,
    title: 'Treatment Plan',
    description: 'AI-generated treatment recommendations',
    category: 'demo'
  }
];
