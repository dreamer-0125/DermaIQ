import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Brain } from 'lucide-react';

const DemoNavigation: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Zap className="w-8 h-8" />
            <h2 className="text-2xl font-bold">DermaIQ Demo</h2>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Experience AI-powered wound care with our comprehensive platform demo showcasing 
            advanced medical analysis and treatment planning capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/demo"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="w-6 h-6 text-green-200" />
              <h3 className="font-semibold">Platform Demo</h3>
            </div>
            <p className="text-blue-100 text-sm">
              Complete platform demo with dashboard, image upload, analysis, treatment plans, consultant services, and DermaIQ SaMD information.
            </p>
          </Link>

          <Link
            to="/dermaiq"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="w-6 h-6 text-orange-200" />
              <h3 className="font-semibold">DermaIQ Application</h3>
            </div>
            <p className="text-blue-100 text-sm">
              Experience AI-powered medical applications with advanced wound analysis and treatment planning.
            </p>
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/demo"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Zap className="w-5 h-5" />
            <span>Start Demo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoNavigation;

