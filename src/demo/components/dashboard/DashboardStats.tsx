import React from 'react';

interface DashboardStatsProps {
  dashboardStats: Array<{
    title: string;
    value: string;
    change: string;
    icon: any;
    color: string;
  }>;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ dashboardStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.color}`}>{stat.change}</p>
            </div>
            <stat.icon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
