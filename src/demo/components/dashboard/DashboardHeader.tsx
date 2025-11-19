import React, { useState, useEffect, useRef } from 'react';
import { 
  User,
  Wifi,
  WifiOff,
  ChevronDown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface DashboardHeaderProps {
  mcpServerStatus: boolean;
  forceMCPConnection: boolean;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  mcpServerStatus, 
  forceMCPConnection,
  onMobileMenuToggle,
  isMobileMenuOpen = false
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    try {
      // console.log('DashboardHeader: Starting logout...');
      setShowUserMenu(false);
      await logout();
      // console.log('DashboardHeader: Logout completed successfully');
    } catch (error) {
      // console.error('DashboardHeader: Failed to log out:', error);
      // Even if logout fails, try to clear local state and redirect
      try {
        // Force redirect to home page
        window.location.href = '/';
      } catch (redirectError) {
        // console.error('DashboardHeader: Failed to redirect after logout error:', redirectError);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Button and Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              )}
            </button>
            
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="HealAI Logo" 
                  className="h-10 w-auto sm:h-12 w-auto"
                  onError={(e) => {
                    // Fallback to favicon if logo.png fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/favicon.ico';
                    target.className = 'h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent truncate">
                  DermaIQ Platform
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  AI-Powered Wound Care Management & Analysis
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Status and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              {(mcpServerStatus || forceMCPConnection) ? (
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Analysis Active</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Demo Mode</span>
                </div>
              )}
            </div>

            {/* Mobile Status Indicator */}
            <div className="sm:hidden">
              {(mcpServerStatus || forceMCPConnection) ? (
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full border border-green-200">
                  <Wifi className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full border border-orange-200">
                  <WifiOff className="w-4 h-4 text-orange-600" />
                </div>
              )}
            </div>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-medium p-1 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
                    {userProfile?.first_name?.charAt(0) || currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm">{userProfile?.first_name || 'User'}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-500">Guest User</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Status Bar - Full Width */}
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center">
            {(mcpServerStatus || forceMCPConnection) ? (
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">AI Analysis Active</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full border border-orange-200">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
