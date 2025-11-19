import React from 'react';

interface QuickActionsProps {
  quickActions: Array<{
    title: string;
    icon: any;
    action: () => void;
  }>;
}

const QuickActions: React.FC<QuickActionsProps> = ({ quickActions }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <action.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">{action.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
