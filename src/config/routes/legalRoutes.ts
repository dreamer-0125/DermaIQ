import { RouteConfig } from './types';
import { PrivacyPolicy, TermsOfService, Security } from '../../pages/legal';

export const legalRoutes: RouteConfig[] = [
  {
    path: '/privacy',
    element: PrivacyPolicy,
    title: 'Privacy Policy',
    description: 'How we protect your data',
    category: 'legal'
  },
  {
    path: '/terms',
    element: TermsOfService,
    title: 'Terms of Service',
    description: 'Our terms and conditions',
    category: 'legal'
  },
  {
    path: '/security',
    element: Security,
    title: 'Security',
    description: 'Our security measures and compliance',
    category: 'legal'
  }
];
