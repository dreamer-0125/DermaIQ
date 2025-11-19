import React, { useState } from 'react';
import { cn } from '../../utils/classNames';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  variant = 'default',
  size = 'md',
  className,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || items.find(item => !item.disabled)?.id || items[0]?.id
  );

  const handleTabClick = (tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const activeTabContent = items.find(item => item.id === activeTab)?.content;

  const tabVariants = {
    default: 'border-b border-gray-200',
    pills: 'bg-gray-100 rounded-lg p-1',
    underline: 'border-b-2 border-gray-200',
  };

  const tabButtonVariants = {
    default: 'border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300',
    pills: 'rounded-md hover:bg-white hover:shadow-sm',
    underline: 'border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300',
  };

  const activeTabButtonVariants = {
    default: 'border-blue-500 text-blue-600',
    pills: 'bg-white shadow-sm text-blue-600',
    underline: 'border-blue-500 text-blue-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className={cn(tabVariants[variant])}>
        <nav className="flex space-x-8" aria-label="Tabs">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              disabled={item.disabled}
              className={cn(
                'whitespace-nowrap font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                sizeClasses[size],
                tabButtonVariants[variant],
                activeTab === item.id && activeTabButtonVariants[variant],
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTabContent}
      </div>
    </div>
  );
};

export { Tabs };
