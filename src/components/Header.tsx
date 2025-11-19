import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Target,
  Settings,
  Users,
  Phone,
  Code,
  ArrowRight,
  Sparkles,
  Camera,
  Zap,
  Building2,
  Car,
  Monitor,
  Video,
  BookOpen,
  ClipboardList,
  Network,
  Truck,
  Activity,
  Microscope,
  Badge,
  Syringe,
  Thermometer,
  Brain,
  MapPin,
  Navigation,
  Star,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';
import { handleAnchorClick } from '../utils/scrollUtils';
import FaviconIcon from './ui/FaviconIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { currentUser, userProfile, logout } = useAuth();

  // Check if a navigation item is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Listen for custom events to open auth modal
  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      // console.log('Received openAuthModal event:', event.detail);
      setAuthMode(event.detail?.mode || 'signup');
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    };
  }, []);

  // const handleSignIn = () => {
  //   setAuthMode('signin');
  //   setIsAuthModalOpen(true);
  // };

  const handleSignUp = () => {
    console.log('Schedule Demo button clicked - opening auth modal');
    setAuthMode('signup');
    setIsAuthModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu when opening auth modal
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      // console.error('Failed to log out:', error);
      // Even if logout fails, close the menu
      setShowUserMenu(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="bg-white sticky shadow-lg top-0 z-50 bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                <FaviconIcon className="h-16 w-16 sm:scale-125" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2 bg-[#EFEFEF] p-1 m-2 rounded-full">
              <div className="relative group">
                <Link
                  to="/"
                  className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${isActive('/')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                    }`}
                >
                  {isActive('/') && <Home className="mr-2 h-4 w-4" />}
                  Home
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <a href="/#hero" onClick={(e) => handleAnchorClick(e, 'hero')} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                      <Crown className="w-4 h-4 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium">Hero Section</div>
                        <div className="text-xs text-gray-500">Co-design your wound care future</div>
                      </div>
                    </a>
                    <a href="/#features" onClick={(e) => handleAnchorClick(e, 'features')} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                      <Sparkles className="w-4 h-4 mr-3 text-teal-500" />
                      <div>
                        <div className="font-medium">Features</div>
                        <div className="text-xs text-gray-500">Platform capabilities</div>
                      </div>
                    </a>
                    <a href="/#how-it-works" onClick={(e) => handleAnchorClick(e, 'how-it-works')} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                      <Zap className="w-4 h-4 mr-3 text-green-500" />
                      <div>
                        <div className="font-medium">How It Works</div>
                        <div className="text-xs text-gray-500">4-step process</div>
                      </div>
                    </a>
                    <a href="/#benefits" onClick={(e) => handleAnchorClick(e, 'benefits')} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                      <Star className="w-4 h-4 mr-3 text-purple-500" />
                      <div>
                        <div className="font-medium">Benefits</div>
                        <div className="text-xs text-gray-500">Why choose DermaIQ</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group">
                <Link
                  to="/solutions"
                  className={`flex items-center px-4 py-3 rounded-full transition-all duration-300 font-medium ${isActive('/solutions')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                    }`}
                >
                  {isActive('/solutions') && <Target className="mr-2 h-4 w-4" />}
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <Link to="/solutions/wound-measurement" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2">
                      <Camera className="w-4 h-4 mr-3 text-teal-500" />
                      <div>
                        <div className="font-medium">AI Wound Measurement</div>
                        <div className="text-xs text-gray-500">Precise wound analysis</div>
                      </div>
                    </Link>
                    <Link to="/solutions/clinical-decision-support" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2">
                      <Brain className="w-4 h-4 mr-3 text-green-500" />
                      <div>
                        <div className="font-medium">Clinical Decision Support</div>
                        <div className="text-xs text-gray-500">Evidence-based guidance</div>
                      </div>
                    </Link>
                    <Link to="/solutions/care-coordination" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2">
                      <Network className="w-4 h-4 mr-3 text-purple-500" />
                      <div>
                        <div className="font-medium">Care Coordination</div>
                        <div className="text-xs text-gray-500">Team collaboration</div>
                      </div>
                    </Link>
                    <Link to="/solutions/telehealth-integration" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2">
                      <Video className="w-4 h-4 mr-3 text-orange-500" />
                      <div>
                        <div className="font-medium">Telehealth Integration</div>
                        <div className="text-xs text-gray-500">Remote wound care</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Services Dropdown */}
              <div className="relative group">
                <Link
                  to="/services"
                  className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${isActive('/services')
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
                    <div className="relative group/core-services">
                      <div className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center">
                          <Microscope className="w-4 h-4 mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Core Services</div>
                            <div className="text-xs text-gray-500">AI-powered wound care tools</div>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 transform group-hover/core-services:rotate-180 transition-transform" />
                      </div>
                      <div className="absolute left-full top-0 ml-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/core-services:opacity-100 group-hover/core-services:visible transition-all duration-300 z-50">
                        <div className="py-2">
                          <Link to="/services/ai-wound-measurement" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Camera className="w-4 h-4 mr-3 text-blue-500" />
                            <div>
                              <div className="font-medium">AI Wound Measurement</div>
                              <div className="text-xs text-gray-500">Preventive, chronic, acute wound assessment</div>
                            </div>
                          </Link>
                          <Link to="/services/infection-detection" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Thermometer className="w-4 h-4 mr-3 text-orange-500" />
                            <div>
                              <div className="font-medium">Infection Detection & Management</div>
                              <div className="text-xs text-gray-500">Advanced imaging and risk assessment</div>
                            </div>
                          </Link>
                          <Link to="/services/chronic-wound-management" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Badge className="w-4 h-4 mr-3 text-green-500" />
                            <div>
                              <div className="font-medium">Chronic Wound Management</div>
                              <div className="text-xs text-gray-500">Diabetic ulcers, pressure injuries, venous wounds</div>
                            </div>
                          </Link>
                          <Link to="/services/surgical-wound-care" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Syringe className="w-4 h-4 mr-3 text-purple-500" />
                            <div>
                              <div className="font-medium">Post-Surgical Wound Care</div>
                              <div className="text-xs text-gray-500">Comprehensive post-operative monitoring</div>
                            </div>
                          </Link>
                          <Link to="/services/patient-education" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <BookOpen className="w-4 h-4 mr-3 text-indigo-500" />
                            <div>
                              <div className="font-medium">Patient Education & Self-Care</div>
                              <div className="text-xs text-gray-500">Empowering patients with knowledge</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="relative group/care-navigation">
                      <div className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center">
                          <Navigation className="w-4 h-4 mr-3 text-teal-500" />
                          <div>
                            <div className="font-medium">Care Navigation</div>
                            <div className="text-xs text-gray-500">Streamlined care coordination</div>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 transform group-hover/care-navigation:rotate-180 transition-transform" />
                      </div>
                      <div className="absolute left-full top-0 ml-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/care-navigation:opacity-100 group-hover/care-navigation:visible transition-all duration-300 z-50">
                        <div className="py-2">
                          <Link to="/services/care-coordination" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Network className="w-4 h-4 mr-3 text-teal-500" />
                            <div>
                              <div className="font-medium">Care Coordination</div>
                              <div className="text-xs text-gray-500">Multi-disciplinary team collaboration</div>
                            </div>
                          </Link>
                          <Link to="/services/referral-management" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <ClipboardList className="w-4 h-4 mr-3 text-green-500" />
                            <div>
                              <div className="font-medium">Specialist Referral Management</div>
                              <div className="text-xs text-gray-500">Seamless specialist connections</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="relative group/delivery-channels">
                      <div className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 mr-3 text-purple-500" />
                          <div>
                            <div className="font-medium">Delivery Channels</div>
                            <div className="text-xs text-gray-500">Flexible care delivery options</div>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 transform group-hover/delivery-channels:rotate-180 transition-transform" />
                      </div>
                      <div className="absolute left-full top-0 ml-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/delivery-channels:opacity-100 group-hover/delivery-channels:visible transition-all duration-300 z-50">
                        <div className="py-2">
                          <Link to="/services/onsite-clinic" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Building2 className="w-4 h-4 mr-3 text-purple-500" />
                            <div>
                              <div className="font-medium">Onsite Wound Care</div>
                              <div className="text-xs text-gray-500">Dedicated wound care facilities</div>
                            </div>
                          </Link>
                          <Link to="/services/nearsite-clinic" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                            <div>
                              <div className="font-medium">Nearsite Clinic</div>
                              <div className="text-xs text-gray-500">Convenient nearby locations</div>
                            </div>
                          </Link>
                          <Link to="/services/mobile-unit" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Car className="w-4 h-4 mr-3 text-orange-500" />
                            <div>
                              <div className="font-medium">Mobile Wound Care Unit</div>
                              <div className="text-xs text-gray-500">Care delivered to your location</div>
                            </div>
                          </Link>
                          <Link to="/services/virtual-care" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                            <Monitor className="w-4 h-4 mr-3 text-green-500" />
                            <div>
                              <div className="font-medium">Virtual Wound Assessment</div>
                              <div className="text-xs text-gray-500">Remote consultation and monitoring</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/tech-base"
                className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${isActive('/tech-base')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
              >
                {isActive('/tech-base') && <Code className="mr-2 h-4 w-4" />}
                Tech Base
              </Link>
              <Link
                to="/about"
                className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 font-medium ${isActive('/about')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
              >
                {isActive('/about') && <Users className="mr-2 h-4 w-4" />}
                About Us
              </Link>
              {/* <Link
                to="/contact"
                className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 font-medium ${isActive('/contact')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </Link> */}
            </nav>

            {/* Desktop Auth/User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : currentUser.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                      <div className="py-2">
                        <Link to="/demo" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-600 transition-all duration-200">
                          <Activity className="w-4 h-4 mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Demo Dashboard</div>
                            <div className="text-xs text-gray-500">Access your demo</div>
                          </div>
                        </Link>
                        <div className="border-t border-gray-100 my-2"></div>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          <div>
                            <div className="font-medium">{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</div>
                            <div className="text-xs text-gray-500">Log out of your account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignUp}
                  className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Schedule Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-menu bg-white shadow-lg">
            <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</div>

                <Link to="/" className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                  <Home className="w-4 h-4 mr-3 text-blue-500" />
                  Home
                </Link>

                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Solutions</div>
                  <Link to="/solutions/wound-measurement" className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Camera className="w-4 h-4 mr-3 text-teal-500" />
                    AI Wound Measurement
                  </Link>
                  <Link to="/solutions/clinical-decision-support" className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Brain className="w-4 h-4 mr-3 text-green-500" />
                    Clinical Decision Support
                  </Link>
                  <Link to="/solutions/care-coordination" className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Network className="w-4 h-4 mr-3 text-purple-500" />
                    Care Coordination
                  </Link>
                  <Link to="/solutions/telehealth-integration" className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Video className="w-4 h-4 mr-3 text-orange-500" />
                    Telehealth Integration
                  </Link>
                </div>

                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Services</div>
                  <div className="flex items-center px-6 py-2 text-sm font-medium text-gray-700">
                    <Microscope className="w-4 h-4 mr-2 text-blue-500" />
                    Core Services
                  </div>
                  <Link to="/services/ai-wound-measurement" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Camera className="w-4 h-4 mr-3 text-blue-500" />
                    AI Wound Measurement
                  </Link>
                  <Link to="/services/infection-detection" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Thermometer className="w-4 h-4 mr-3 text-orange-500" />
                    Infection Detection & Management
                  </Link>
                  <Link to="/services/chronic-wound-management" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Badge className="w-4 h-4 mr-3 text-green-500" />
                    Chronic Wound Management
                  </Link>
                  <Link to="/services/surgical-wound-care" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Syringe className="w-4 h-4 mr-3 text-purple-500" />
                    Post-Surgical Wound Care
                  </Link>
                  <Link to="/services/patient-education" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <BookOpen className="w-4 h-4 mr-3 text-indigo-500" />
                    Patient Education & Self-Care
                  </Link>

                  <div className="flex items-center px-6 py-2 text-sm font-medium text-gray-700">
                    <Navigation className="w-4 h-4 mr-2 text-teal-500" />
                    Care Navigation
                  </div>
                  <Link to="/services/care-coordination" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Network className="w-4 h-4 mr-3 text-teal-500" />
                    Care Coordination
                  </Link>
                  <Link to="/services/referral-management" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <ClipboardList className="w-4 h-4 mr-3 text-green-500" />
                    Specialist Referral Management
                  </Link>

                  <div className="flex items-center px-6 py-2 text-sm font-medium text-gray-700">
                    <Truck className="w-4 h-4 mr-2 text-purple-500" />
                    Delivery Channels
                  </div>
                  <Link to="/services/onsite-clinic" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Building2 className="w-4 h-4 mr-3 text-purple-500" />
                    Onsite Wound Care
                  </Link>
                  <Link to="/services/nearsite-clinic" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                    Nearsite Clinic
                  </Link>
                  <Link to="/services/mobile-unit" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Car className="w-4 h-4 mr-3 text-orange-500" />
                    Mobile Wound Care Unit
                  </Link>
                  <Link to="/services/virtual-care" className="flex items-center px-9 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <Monitor className="w-4 h-4 mr-3 text-green-500" />
                    Virtual Wound Assessment
                  </Link>
                </div>

                <Link to="/tech-base" className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                  <Code className="w-4 h-4 mr-3 text-blue-500" />
                  Tech Base
                </Link>
                <Link to="/about" className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                  <Users className="w-4 h-4 mr-3 text-teal-500" />
                  About Us
                </Link>
                <Link to="/contact" className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                  <Phone className="w-4 h-4 mr-3 text-orange-500" />
                  Contact
                </Link>
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2">
                      <div className="text-sm text-gray-500">Signed in as</div>
                      <div className="font-medium text-gray-900">{userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : currentUser.email}</div>
                    </div>
                    <Link to="/demo" className="block px-3 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium text-center transition-all duration-200">
                      Go to Demo Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block w-full px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <div className="px-3">
                    <button
                      onClick={handleSignUp}
                      className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Schedule Demo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;