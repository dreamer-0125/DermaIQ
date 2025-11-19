import React from 'react';
import { Button } from '../../design-system/components';
import { Card } from '../../design-system/components/layout';
import { Plus, Search, FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  fullScreen?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  fullScreen = false
}) => {
  const defaultIcons = {
    add: <Plus className="w-8 h-8 text-gray-400" />,
    search: <Search className="w-8 h-8 text-gray-400" />,
    document: <FileText className="w-8 h-8 text-gray-400" />,
  };

  const displayIcon = icon || defaultIcons.document;

  const content = (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          {displayIcon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'primary'}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {action.label}
        </Button>
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

export { EmptyState };
