import { RouteConfig } from './types';
import { 
  HomePage, 
  AboutUs, 
  Careers, 
  Press, 
  Contact, 
  TechBase
} from '../../pages/main';

export const mainRoutes: RouteConfig[] = [
  {
    path: '/',
    element: HomePage,
    title: 'Home',
    description: 'DermaIQ - AI-Powered Wound Care Solutions',
    category: 'main'
  },
  {
    path: '/about',
    element: AboutUs,
    title: 'About Us',
    description: 'Learn about our mission and team',
    category: 'main'
  },
  {
    path: '/careers',
    element: Careers,
    title: 'Careers',
    description: 'Join our team and make a difference',
    category: 'main'
  },
  {
    path: '/press',
    element: Press,
    title: 'Press',
    description: 'Latest news and media resources',
    category: 'main'
  },
  {
    path: '/contact',
    element: Contact,
    title: 'Contact',
    description: 'Get in touch with our team',
    category: 'main'
  },
  {
    path: '/tech-base',
    element: TechBase,
    title: 'Tech Base',
    description: 'Our technology foundation and system architecture',
    category: 'main'
  }
];
