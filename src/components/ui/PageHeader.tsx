import React from 'react';
import { Button } from '../../design-system/components';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  onBack,
  backLabel = 'Back',
  className = ''
}) => {
  return (
    <div className={`border-b border-gray-200 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-2 text-gray-400">/</span>
                    )}
                    {breadcrumb.href ? (
                      <a
                        href={breadcrumb.href}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        {breadcrumb.label}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-900 font-medium">
                        {breadcrumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {/* Back Button */}
              {onBack && (
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={onBack}
                  >
                    {backLabel}
                  </Button>
                </div>
              )}

              {/* Title and Description */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-2 text-gray-600 max-w-3xl">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex items-center space-x-3 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PageHeader };
