import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../design-system/components/form';
import { 
  Home, 
  Code, 
  Users, 
  Phone,
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
  Monitor,
  ArrowRight
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleDemo: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  onScheduleDemo 
}) => {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      // console.error('Failed to log out:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white shadow-lg">
      <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* Navigation Links */}
        <div className="space-y-2">
          {/* Auth Section */}
          <div>
          {currentUser ? (
            <div className="space-y-3">
              <div className="px-3 py-2">
                <div className="text-sm text-gray-500">Signed in as</div>
                <div className="font-medium text-gray-900">
                  {userProfile 
                    ? `${userProfile.first_name} ${userProfile.last_name}` 
                    : currentUser.email}
                </div>
              </div>
              <Link 
                to="/demo" 
                onClick={onClose}
                className="block px-3 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium text-center transition-all duration-200"
              >
                Go to Demo Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-3">
              <Button
                onClick={onScheduleDemo}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Schedule Demo
              </Button>
            </div>
          )}
          </div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-t border-gray-200 pt-4">
            Navigation
          </div>

          <Link 
            to="/" 
            onClick={onClose}
            className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-3 text-blue-500" />
            Home
          </Link>

          {/* Solutions */}
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-500">Solutions</div>
            <Link 
              to="/solutions/wound-measurement" 
              onClick={onClose}
              className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Camera className="w-4 h-4 mr-3 text-teal-500" />
              AI Wound Measurement
            </Link>
            <Link 
              to="/solutions/clinical-decision-support" 
              onClick={onClose}
              className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Brain className="w-4 h-4 mr-3 text-green-500" />
              Clinical Decision Support
            </Link>
            <Link 
              to="/solutions/care-coordination" 
              onClick={onClose}
              className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Network className="w-4 h-4 mr-3 text-purple-500" />
              Care Coordination
            </Link>
            <Link 
              to="/solutions/telehealth-integration" 
              onClick={onClose}
              className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Video className="w-4 h-4 mr-3 text-orange-500" />
              Telehealth Integration
            </Link>
          </div>

          {/* Services */}
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-500">Services</div>
            
            {/* Core Services */}
            <div className="flex items-center px-6 py-2 text-sm font-medium text-gray-700">
              <Microscope className="w-4 h-4 mr-2 text-blue-500" />
              Core Services
            </div>
            <Link 
              to="/services/ai-wound-measurement" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Camera className="w-4 h-4 mr-3 text-blue-500" />
              AI Wound Measurement
            </Link>
            <Link 
              to="/services/infection-detection" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Thermometer className="w-4 h-4 mr-3 text-orange-500" />
              Infection Detection & Management
            </Link>
            <Link 
              to="/services/chronic-wound-management" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Badge className="w-4 h-4 mr-3 text-green-500" />
              Chronic Wound Management
            </Link>
            <Link 
              to="/services/surgical-wound-care" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Syringe className="w-4 h-4 mr-3 text-purple-500" />
              Post-Surgical Wound Care
            </Link>
            <Link 
              to="/services/patient-education" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-3 text-indigo-500" />
              Patient Education & Self-Care
            </Link>

            {/* Care Navigation */}
            <div className="flex items-center px-6 py-2 text-sm font-medium text-gray-700">
              <NavIcon className="w-4 h-4 mr-2 text-teal-500" />
              Care Navigation
            </div>
            <Link 
              to="/services/care-coordination" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Network className="w-4 h-4 mr-3 text-teal-500" />
              Care Coordination
            </Link>
            <Link 
              to="/services/referral-management" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <ClipboardList className="w-4 h-4 mr-3 text-green-500" />
              Specialist Referral Management
            </Link>

            {/* Delivery Channels */}
            <div className="flex items-center px-6 py-2 text-sm font-medium text-gray-700">
              <Truck className="w-4 h-4 mr-2 text-purple-500" />
              Delivery Channels
            </div>
            <Link 
              to="/services/onsite-clinic" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Building2 className="w-4 h-4 mr-3 text-purple-500" />
              Onsite Wound Care
            </Link>
            <Link 
              to="/services/nearsite-clinic" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
              Nearsite Clinic
            </Link>
            <Link 
              to="/services/mobile-unit" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Car className="w-4 h-4 mr-3 text-orange-500" />
              Mobile Wound Care Unit
            </Link>
            <Link 
              to="/services/virtual-care" 
              onClick={onClose}
              className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Monitor className="w-4 h-4 mr-3 text-green-500" />
              Virtual Wound Assessment
            </Link>
          </div>

          <Link 
            to="/tech-base" 
            onClick={onClose}
            className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <Code className="w-4 h-4 mr-3 text-blue-500" />
            Tech Base
          </Link>
          <Link 
            to="/about" 
            onClick={onClose}
            className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <Users className="w-4 h-4 mr-3 text-teal-500" />
            About Us
          </Link>
          <Link 
            to="/contact" 
            onClick={onClose}
            className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <Phone className="w-4 h-4 mr-3 text-orange-500" />
            Contact
          </Link>
        </div>

        
      </div>
    </div>
  );
};

export { MobileMenu };
