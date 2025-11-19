import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useScheduleDemo } from '../../../hooks/useScheduleDemo';
import { AuthModal } from '../../auth/AuthModal';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { Button } from '../../../design-system/components/form';
import { ArrowRight, Menu, X } from 'lucide-react';
import FaviconIcon from '../../ui/FaviconIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { 
    isAuthModalOpen, 
    authMode, 
    handleScheduleDemo, 
    closeAuthModal 
  } = useScheduleDemo();

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

  const handleScheduleDemoClick = () => {
    setIsMenuOpen(false);
    handleScheduleDemo();
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-lg bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                <FaviconIcon className="h-16 w-16 sm:scale-125" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <Navigation />
            </div>

            {/* Desktop Auth/User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {currentUser ? (
                <UserMenu />
              ) : (
                <Button
                  onClick={handleScheduleDemoClick}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="bg-[#3681DE] hover:bg-[#2B6BC7] shadow-lg hover:shadow-xl"
                >
                  Schedule Demo
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          <MobileMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onScheduleDemo={handleScheduleDemoClick}
          />
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </>
  );
};

export { Header };
