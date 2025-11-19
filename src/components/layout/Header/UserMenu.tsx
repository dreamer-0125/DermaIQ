import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Dropdown } from '../../../design-system/components/form';
import { Button } from '../../../design-system/components/form';
import { User, ChevronDown, Activity, LogOut } from 'lucide-react';

const UserMenu: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      // console.error('Failed to log out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userDisplayName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name}` 
    : currentUser?.email || 'User';

  const dropdownItems = [
    {
      id: 'demo',
      label: 'Demo Dashboard',
      icon: <Activity className="w-4 h-4" />,
      onClick: () => {
        navigate('/demo');
      }
    },
    {
      id: 'logout',
      label: isLoggingOut ? 'Signing Out...' : 'Sign Out',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
      disabled: isLoggingOut
    }
  ];

  const trigger = (
    <Button
      variant="ghost"
      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50"
    >
      <User className="h-5 w-5" />
      <span className="font-medium hidden sm:block">{userDisplayName}</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="relative">
      <Dropdown
        trigger={trigger}
        items={dropdownItems}
        placement="bottom-right"
      />
    </div>
  );
};

export { UserMenu };
