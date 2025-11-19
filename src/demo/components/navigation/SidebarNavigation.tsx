import React from 'react';
import { 
  Home,
  Upload,
  Eye,
  FileText,
  User,
  Heart,
  UserCircle,
  X,
  Wrench,
  Info,
  ShoppingBag
} from 'lucide-react';

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab: (tab: 'profile' | 'dashboard' | 'upload' | 'result' | 'treatment' | 'consultant' | 'marketplace' | 'tools' | 'about' | 'donation') => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  activeTab, 
  setActiveTab,
  isMobileMenuOpen = false,
  onMobileMenuClose
}) => {
  const navigationItems = [
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Images', icon: Upload },
    { id: 'result', label: 'Results', icon: Eye },
    { id: 'treatment', label: 'Treatment Plans', icon: FileText },
    { id: 'consultant', label: 'Consultant Services', icon: User },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'tools', label: 'VBC Super Agent Tools', icon: Wrench },
    { id: 'about', label: 'About DermaIQ', icon: Info },
    { id: 'donation', label: 'Support Our Mission', icon: Heart }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    // Close mobile menu when a tab is selected
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const sidebarContent = (
    <div className="w-64 bg-white shadow-sm border-r h-full flex flex-col">
      <nav className="p-4 flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <button
            onClick={onMobileMenuClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close mobile menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onMobileMenuClose}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default SidebarNavigation;
