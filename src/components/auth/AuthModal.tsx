import React, { useState } from 'react';
import { Modal } from '../../design-system/components';
import { AuthForm } from './AuthForm';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, signup } = useAuth();

  // Debug logging
  React.useEffect(() => {
    // console.log('AuthModal props:', { isOpen, initialMode, mode });
  }, [isOpen, initialMode, mode]);

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await login(data.email, data.password);
      } else {
        if (!data.firstName || !data.lastName) {
          throw new Error('First name and last name are required');
        }
        await signup(data.email, data.password, data.firstName, data.lastName, '');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'signin' ? 'Sign In' : 'Book a Demo'}
      size="md"
    >
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onSwitchMode={handleSwitchMode}
        loading={loading}
        error={error || undefined}
      />
    </Modal>
  );
};

export { AuthModal };