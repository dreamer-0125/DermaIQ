import React from 'react';
import { AuthProvider } from '../AuthContext';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Main application provider that combines all context providers
 * This ensures proper provider hierarchy and makes it easy to add new providers
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
