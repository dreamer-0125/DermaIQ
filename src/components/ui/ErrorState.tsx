import React from 'react';
import { Alert, Button } from '../../design-system/components';
import { Card } from '../../design-system/components/layout';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'compact';
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryText = 'Try Again',
  className = '',
  fullScreen = false,
  variant = 'default'
}) => {
  const content = (
    <div className={`text-center ${className}`}>
      {variant === 'default' ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 max-w-md mx-auto">{message}</p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              variant="primary"
            >
              {retryText}
            </Button>
          )}
        </div>
      ) : (
        <Alert
          variant="error"
          title={title}
          description={message}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="max-w-md w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-8">
      {content}
    </Card>
  );
};

export { ErrorState };
