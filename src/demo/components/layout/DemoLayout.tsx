import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../navigation/SidebarNavigation';
import DashboardHeader from '../dashboard/DashboardHeader';

interface DemoLayoutProps {
  children: React.ReactNode;
}

const DemoLayout: React.FC<DemoLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map URL paths to tab names
  const getTabFromPath = (pathname: string): string => {
    if (pathname.includes('/demo/profile')) return 'profile';
    if (pathname.includes('/demo/dashboard')) return 'dashboard';
    if (pathname.includes('/demo/upload')) return 'upload';
    if (pathname.includes('/demo/result')) return 'result';
    if (pathname.includes('/demo/treatment')) return 'treatment';
    if (pathname.includes('/demo/consultant')) return 'consultant';
    if (pathname.includes('/demo/marketplace')) return 'marketplace';
    if (pathname.includes('/demo/tools')) return 'tools';
    if (pathname.includes('/demo/about')) return 'about';
    if (pathname.includes('/demo/donation')) return 'donation';
    return 'dashboard'; // default
  };

  // Handle URL changes to update active tab
  useEffect(() => {
    const newTab = getTabFromPath(location.pathname);
    setActiveTab(newTab);
  }, [location.pathname]);

  // Handle tab changes with URL navigation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Navigate to the corresponding URL
    const pathMap: { [key: string]: string } = {
      'profile': '/demo/profile',
      'dashboard': '/demo/dashboard',
      'upload': '/demo/upload',
      'result': '/demo/result',
      'treatment': '/demo/treatment',
      'consultant': '/demo/consultant',
      'marketplace': '/demo/marketplace',
      'tools': '/demo/tools',
      'about': '/demo/about',
      'donation': '/demo/donation'
    };

    const path = pathMap[tab];
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DashboardHeader 
        mcpServerStatus={true}
        forceMCPConnection={false}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DemoLayout;
