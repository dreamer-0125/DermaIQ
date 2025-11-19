import { RouteConfig } from './types';
import { Services, Solutions } from '../../pages/business';
import { 
  WoundMeasurement,
  ClinicalDecisionSupport,
  CareCoordination,
  TelehealthIntegration
} from '../../pages/solutions';
import {
  AIWoundMeasurement,
  InfectionDetection,
  ChronicWoundManagement,
  SurgicalWoundCare,
  PatientEducation,
  CareCoordinationService,
  ReferralManagement,
  OnsiteClinic,
  NearsiteClinic,
  MobileUnit,
  VirtualCare
} from '../../pages/services';

export const businessRoutes: RouteConfig[] = [
  // Main Business Pages
  {
    path: '/services',
    element: Services,
    title: 'Services',
    description: 'Our comprehensive wound care services',
    category: 'main'
  },
  {
    path: '/solutions',
    element: Solutions,
    title: 'Solutions',
    description: 'Our comprehensive wound care solutions',
    category: 'solutions'
  },

  // Solutions Routes
  {
    path: '/solutions/wound-measurement',
    element: WoundMeasurement,
    title: 'AI Wound Measurement',
    description: 'Precise wound analysis and measurement',
    category: 'solutions'
  },
  {
    path: '/solutions/clinical-decision-support',
    element: ClinicalDecisionSupport,
    title: 'Clinical Decision Support',
    description: 'Evidence-based clinical guidance',
    category: 'solutions'
  },
  {
    path: '/solutions/care-coordination',
    element: CareCoordination,
    title: 'Care Coordination',
    description: 'Streamlined care team collaboration',
    category: 'solutions'
  },
  {
    path: '/solutions/telehealth-integration',
    element: TelehealthIntegration,
    title: 'Telehealth Integration',
    description: 'Seamless remote care delivery',
    category: 'solutions'
  },

  // Services Routes
  {
    path: '/services/ai-wound-measurement',
    element: AIWoundMeasurement,
    title: 'AI Wound Measurement Service',
    description: 'Advanced AI-powered wound assessment',
    category: 'services'
  },
  {
    path: '/services/infection-detection',
    element: InfectionDetection,
    title: 'Infection Detection & Management',
    description: 'Early detection and treatment of infections',
    category: 'services'
  },
  {
    path: '/services/chronic-wound-management',
    element: ChronicWoundManagement,
    title: 'Chronic Wound Management',
    description: 'Comprehensive chronic wound care',
    category: 'services'
  },
  {
    path: '/services/surgical-wound-care',
    element: SurgicalWoundCare,
    title: 'Post-Surgical Wound Care',
    description: 'Specialized surgical wound management',
    category: 'services'
  },
  {
    path: '/services/patient-education',
    element: PatientEducation,
    title: 'Patient Education & Self-Care',
    description: 'Empowering patients with knowledge',
    category: 'services'
  },
  {
    path: '/services/care-coordination',
    element: CareCoordinationService,
    title: 'Care Coordination Service',
    description: 'Comprehensive care team management',
    category: 'services'
  },
  {
    path: '/services/referral-management',
    element: ReferralManagement,
    title: 'Specialist Referral Management',
    description: 'Streamlined specialist referrals',
    category: 'services'
  },
  {
    path: '/services/onsite-clinic',
    element: OnsiteClinic,
    title: 'Onsite Wound Care',
    description: 'Private, branded wound care centers',
    category: 'services'
  },
  {
    path: '/services/nearsite-clinic',
    element: NearsiteClinic,
    title: 'Nearsite Clinic',
    description: 'Shared or dedicated DermaIQ clinics',
    category: 'services'
  },
  {
    path: '/services/mobile-unit',
    element: MobileUnit,
    title: 'Mobile Wound Care Unit',
    description: 'Mobile services to your facility',
    category: 'services'
  },
  {
    path: '/services/virtual-care',
    element: VirtualCare,
    title: 'Virtual Wound Assessment',
    description: '24/7 access via telehealth platform',
    category: 'services'
  }
];
