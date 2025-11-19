import { useState } from 'react';

export const useScheduleDemo = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleScheduleDemo = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return {
    isAuthModalOpen,
    authMode,
    handleScheduleDemo,
    closeAuthModal,
    setAuthMode
  };
};
