import React from 'react';
import { 
  Brain, 
  Shield, 
  Database, 
  Settings, 
  CheckCircle, 
  Eye, 
  Lock, 
  FileText, 
  Users, 
  Activity, 
  Smartphone 
} from 'lucide-react';
import DemoLayout from '../components/layout/DemoLayout';

const About: React.FC = () => {
  return (
    <DemoLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">About DermaIQ</h2>
          
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="w-10 h-10 text-blue-600" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Software as a Medical Device (SaMD)
              </h3>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              DermaIQ is a comprehensive AI-powered wound care platform that qualifies as Software as a Medical Device (SaMD), 
              providing diagnostic and therapeutic functions for wound assessment and treatment planning.
            </p>
          </div>

          {/* Regulatory Definition */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">Regulatory Definition</h4>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-gray-700 mb-4">
                <strong>SaMD</strong> is defined by the International Medical Device Regulators Forum (IMDRF) as:
              </p>
              <blockquote className="text-lg italic text-gray-800 border-l-4 border-blue-500 pl-4 mb-4">
                "Software intended to be used for one or more medical purposes that perform these purposes without being part of a hardware medical device."
              </blockquote>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">DermaIQ SaMD Functions:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• AI wound measurement</li>
                    <li>• Infection detection via image analysis</li>
                    <li>• Treatment recommendations</li>
                    <li>• Integration with clinical workflows</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Why This Matters:</h5>
                  <p className="text-sm text-gray-600">
                    Because DermaIQ detects possible infection (diagnostic function) and provides treatment recommendations (therapeutic function), 
                    it qualifies as SaMD in most jurisdictions and will need compliance before launch in healthcare markets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Pathways */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">Regulatory Pathways</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'United States (FDA)',
                  icon: <Shield className="w-8 h-8 text-blue-500" />,
                  color: 'bg-blue-50 border-blue-200',
                  items: [
                    'FDA 21 CFR Part 11 (electronic records)',
                    'FDA SaMD Guidance',
                    'Likely Class II device (moderate risk) → 510(k) premarket notification',
                    'Special attention if using AI/ML: FDA has a proposed regulatory framework for adaptive algorithms'
                  ]
                },
                {
                  title: 'European Union (MDR 2017/745)',
                  icon: <Database className="w-8 h-8 text-green-500" />,
                  color: 'bg-green-50 border-green-200',
                  items: [
                    'CE Mark under Medical Device Regulation',
                    'Likely Class IIa or IIb depending on risk',
                    'Requires ISO 13485 quality management and clinical evaluation'
                  ]
                },
                {
                  title: 'Canada (Health Canada)',
                  icon: <Settings className="w-8 h-8 text-purple-500" />,
                  color: 'bg-purple-50 border-purple-200',
                  items: [
                    'Medical Device License (Class II+)',
                    'Follows IMDRF guidelines'
                  ]
                }
              ].map((pathway, index) => (
                <div key={index} className={`${pathway.color} rounded-xl p-6 border-2`}>
                  <div className="flex items-center space-x-3 mb-4">
                    {pathway.icon}
                    <h5 className="font-semibold text-gray-900">{pathway.title}</h5>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {pathway.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* SaMD Development Framework */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">SaMD Development Framework</h4>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h5 className="text-xl font-bold mb-6 text-center">Following IEC 62304 (medical device software lifecycle)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Concept & Intended Use',
                    description: 'Define medical purpose (wound measurement, infection detection, triage)',
                    icon: <Brain className="w-6 h-6" />
                  },
                  {
                    title: 'Risk Classification',
                    description: 'Risk to patient if software fails → influences documentation & testing requirements',
                    icon: <Shield className="w-6 h-6" />
                  },
                  {
                    title: 'Design & Development Controls',
                    description: 'Use a Quality Management System (ISO 13485)',
                    icon: <Settings className="w-6 h-6" />
                  },
                  {
                    title: 'Verification & Validation',
                    description: 'Clinical validation against gold standards (manual wound measurement, lab culture results)',
                    icon: <CheckCircle className="w-6 h-6" />
                  }
                ].map((framework, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      {framework.icon}
                    </div>
                    <h6 className="font-semibold mb-2">{framework.title}</h6>
                    <p className="text-blue-100 text-sm">{framework.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <h6 className="font-semibold mb-2">Cybersecurity & HIPAA Compliance</h6>
                  <p className="text-blue-100 text-sm">Ensure data security and privacy compliance</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <h6 className="font-semibold mb-2">Post-Market Surveillance</h6>
                  <p className="text-blue-100 text-sm">Ongoing monitoring for model drift and safety issues</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Specific Considerations */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">AI-Specific Considerations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Explainability',
                  description: 'Provide transparency in AI decision-making (heatmaps, scoring)',
                  icon: <Eye className="w-6 h-6 text-blue-600" />,
                  color: 'bg-blue-50'
                },
                {
                  title: 'Locked vs Adaptive Algorithms',
                  description: 'FDA prefers locked models unless you have an approved "Predetermined Change Control Plan"',
                  icon: <Lock className="w-6 h-6 text-green-600" />,
                  color: 'bg-green-50'
                },
                {
                  title: 'Training Data Traceability',
                  description: 'Document dataset sources and bias checks',
                  icon: <FileText className="w-6 h-6 text-purple-600" />,
                  color: 'bg-purple-50'
                }
              ].map((consideration, index) => (
                <div key={index} className={`${consideration.color} rounded-xl p-6 border`}>
                  <div className="flex items-center space-x-3 mb-4">
                    {consideration.icon}
                    <h5 className="font-semibold text-gray-900">{consideration.title}</h5>
                  </div>
                  <p className="text-gray-600 text-sm">{consideration.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Business & Product Strategy */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Business & Product Strategy in SaMD</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Clinical Decision Support (CDS) Tool',
                  description: 'Lowers regulatory burden if physician remains final decision-maker',
                  icon: <Users className="w-6 h-6" />,
                  risk: 'Low'
                },
                {
                  title: 'Automated Triage + Monitoring Platform',
                  description: 'Higher regulatory scrutiny but stronger market differentiation',
                  icon: <Activity className="w-6 h-6" />,
                  risk: 'Medium'
                },
                {
                  title: 'Integration with Hardware Partner',
                  description: 'Could bundle as combination product (e.g., fluorescence imaging device)',
                  icon: <Smartphone className="w-6 h-6" />,
                  risk: 'Medium'
                }
              ].map((strategy, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {strategy.icon}
                      <h5 className="font-semibold text-gray-900">{strategy.title}</h5>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      strategy.risk === 'Low' ? 'bg-green-100 text-green-700' :
                      strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {strategy.risk} Risk
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default About;
