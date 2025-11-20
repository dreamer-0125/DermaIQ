import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Target, 
  Settings, 
  Code, 
  Users, 
  ChevronDown,
  Crown,
  Sparkles,
  Zap,
  Star,
  Camera,
  Brain,
  Network,
  Video,
  Microscope,
  Thermometer,
  Badge,
  Syringe,
  BookOpen,
  Navigation as NavIcon,
  ClipboardList,
  Truck,
  Building2,
  MapPin,
  Car,
  Monitor
} from 'lucide-react';
import { handleAnchorClick } from '../../../utils/scrollUtils';


const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const homeItems = [
    {
      label: 'Hero Section',
      path: '/#hero',
      icon: Crown,
      description: 'Co-design your wound care future',
      color: 'text-blue-500'
    },
    {
      label: 'Features',
      path: '/#features',
      icon: Sparkles,
      description: 'Platform capabilities',
      color: 'text-teal-500'
    },
    {
      label: 'How It Works',
      path: '/#how-it-works',
      icon: Zap,
      description: '4-step process',
      color: 'text-green-500'
    },
    {
      label: 'Benefits',
      path: '/#benefits',
      icon: Star,
      description: 'Why choose DermaIQ',
      color: 'text-purple-500'
    }
  ];

  const solutionsItems = [
    {
      label: 'AI Wound Measurement',
      path: '/solutions/wound-measurement',
      icon: Camera,
      description: 'Precise wound analysis',
      color: 'text-teal-500'
    },
    {
      label: 'Clinical Decision Support',
      path: '/solutions/clinical-decision-support',
      icon: Brain,
      description: 'Evidence-based guidance',
      color: 'text-green-500'
    },
    {
      label: 'Care Coordination',
      path: '/solutions/care-coordination',
      icon: Network,
      description: 'Team collaboration',
      color: 'text-purple-500'
    },
    {
      label: 'Telehealth Integration',
      path: '/solutions/telehealth-integration',
      icon: Video,
      description: 'Remote wound care',
      color: 'text-orange-500'
    }
  ];

  const coreServicesItems = [
    {
      label: 'AI Wound Measurement',
      path: '/services/ai-wound-measurement',
      icon: Camera,
      description: 'Preventive, chronic, acute wound assessment',
      color: 'text-blue-500'
    },
    {
      label: 'Infection Detection & Management',
      path: '/services/infection-detection',
      icon: Thermometer,
      description: 'Advanced imaging and risk assessment',
      color: 'text-orange-500'
    },
    {
      label: 'Chronic Wound Management',
      path: '/services/chronic-wound-management',
      icon: Badge,
      description: 'Diabetic ulcers, pressure injuries, venous wounds',
      color: 'text-green-500'
    },
    {
      label: 'Post-Surgical Wound Care',
      path: '/services/surgical-wound-care',
      icon: Syringe,
      description: 'Comprehensive post-operative monitoring',
      color: 'text-purple-500'
    },
    {
      label: 'Patient Education & Self-Care',
      path: '/services/patient-education',
      icon: BookOpen,
      description: 'Empowering patients with knowledge',
      color: 'text-indigo-500'
    }
  ];

  const careNavigationItems = [
    {
      label: 'Care Coordination',
      path: '/services/care-coordination',
      icon: Network,
      description: 'Multi-disciplinary team collaboration',
      color: 'text-teal-500'
    },
    {
      label: 'Specialist Referral Management',
      path: '/services/referral-management',
      icon: ClipboardList,
      description: 'Seamless specialist connections',
      color: 'text-green-500'
    }
  ];

  const deliveryChannelsItems = [
    {
      label: 'Onsite Wound Care',
      path: '/services/onsite-clinic',
      icon: Building2,
      description: 'Dedicated wound care facilities',
      color: 'text-purple-500'
    },
    {
      label: 'Nearsite Clinic',
      path: '/services/nearsite-clinic',
      icon: MapPin,
      description: 'Convenient nearby locations',
      color: 'text-indigo-500'
    },
    {
      label: 'Mobile Wound Care Unit',
      path: '/services/mobile-unit',
      icon: Car,
      description: 'Care delivered to your location',
      color: 'text-orange-500'
    },
    {
      label: 'Virtual Wound Assessment',
      path: '/services/virtual-care',
      icon: Monitor,
      description: 'Remote consultation and monitoring',
      color: 'text-green-500'
    }
  ];

  const DropdownMenu: React.FC<{
    items: Array<{
      label: string;
      path: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
      color: string;
    }>;
    className?: string;
  }> = ({ items, className }) => (
    <div className={`absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${className}`}>
      <div className="py-2">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={(e) => item.path.startsWith('/#') ? handleAnchorClick(e, item.path.split('#')[1]) : undefined}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2"
          >
            <item.icon className={`w-4 h-4 mr-3 ${item.color}`} />
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const NestedDropdownMenu: React.FC<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    color: string;
    items: Array<{
      label: string;
      path: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
      color: string;
    }>;
  }> = ({ label, icon: Icon, description, color, items }) => (
    <div className="relative group/nested">
      <div className="flex items-center justify-between px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
        <div className="flex items-center">
          <Icon className={`w-4 h-4 mr-3 ${color}`} />
          <div>
            <div className="font-medium">{label}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 transform group-hover/nested:rotate-180 transition-transform" />
      </div>
      <div className="absolute left-full top-0 ml-0.4 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-300 z-50">
        <div className="py-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200"
            >
              <item.icon className={`w-4 h-4 mr-3 ${item.color}`} />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <nav className="flex space-x-2 bg-[#EFEFEF] p-1 m-2 rounded-full">
      {/* Home */}
      <div className="relative group">
        <Link
          to="/"
          className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${
            isActive('/')
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
          }`}
        >
          {isActive('/') && <Home className="mr-2 h-4 w-4" />}
          Home
          <ChevronDown className="ml-1 h-4 w-4" />
        </Link>
        <DropdownMenu items={homeItems} />
      </div>

      {/* Solutions */}
      <div className="relative group">
        <Link
          to="/solutions"
          className={`flex items-center px-4 py-3 rounded-full transition-all duration-300 font-medium ${
            isActive('/solutions')
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
          }`}
        >
          {isActive('/solutions') && <Target className="mr-2 h-4 w-4" />}
          Solutions
          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
        </Link>
        <DropdownMenu items={solutionsItems} />
      </div>

      {/* Services */}
      <div className="relative group">
        <Link
          to="/services"
          className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${
            isActive('/services')
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
          }`}
        >
          {isActive('/services') && <Settings className="mr-2 h-4 w-4" />}
          Services
          <ChevronDown className="ml-1 h-4 w-4" />
        </Link>
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="py-2">
            <NestedDropdownMenu
              label="Core Services"
              icon={Microscope}
              description="AI-powered wound care tools"
              color="text-blue-500"
              items={coreServicesItems}
            />
            <NestedDropdownMenu
              label="Care Navigation"
              icon={NavIcon}
              description="Streamlined care coordination"
              color="text-teal-500"
              items={careNavigationItems}
            />
            <NestedDropdownMenu
              label="Delivery Channels"
              icon={Truck}
              description="Flexible care delivery options"
              color="text-purple-500"
              items={deliveryChannelsItems}
            />
          </div>
        </div>
      </div>

      {/* Tech Base */}
      <Link
        to="/tech-base"
        className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${
          isActive('/tech-base')
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
        }`}
      >
        {isActive('/tech-base') && <Code className="mr-2 h-4 w-4" />}
        Tech Base
      </Link>

      {/* About Us */}
      <Link
        to="/about"
        className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${
          isActive('/about')
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
        }`}
      >
        {isActive('/about') && <Users className="mr-2 h-4 w-4" />}
        About Us
      </Link>
    </nav>
  );
};

export { Navigation };
