import React from 'react';
import { 
  Pill, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  Brain 
} from 'lucide-react';

interface VBCSuperAgentToolsProps {
  onToolClick: (toolName: string) => void;
}

const VBCSuperAgentTools: React.FC<VBCSuperAgentToolsProps> = ({ onToolClick }) => {
  const services = [
    { 
      title: 'MedOpti™', 
      description: 'AI-powered medication optimization analyzing 10,000+ drug pricing scenarios across pharmacies to secure maximum savings for wound care treatments', 
      icon: Pill, 
      status: 'active',
      color: 'blue',
      modules: ['Wound Care Formulary', 'Antibiotic Optimization', 'Cost Analysis']
    },
    { 
      title: 'PolicyPulse™', 
      description: 'Real-time policy monitoring catching formulary changes and coverage updates affecting wound care prescriptions and procedures', 
      icon: Shield, 
      status: 'active',
      color: 'green',
      modules: ['Policy Tracking', 'Impact Analysis', 'Coverage Updates']
    },
    { 
      title: 'ReimburseRight™', 
      description: 'Intelligent pre-authorization and claims processing based on ACO risk contracts and value-based arrangements for wound care', 
      icon: FileText, 
      status: 'active',
      color: 'red',
      modules: ['Z-Score Analytics', 'Contract Tools', 'Pre-Authorization']
    },
    { 
      title: 'AdvocateIQ™', 
      description: 'Network optimization identifying highest-performing wound care specialists and care coordination opportunities', 
      icon: Users, 
      status: 'active',
      color: 'purple',
      modules: ['Specialist Network', 'Care Coordination', 'Outcome Tracking']
    },
    { 
      title: 'CLAIMS™', 
      description: 'Predictive billing dispute prevention and claims accuracy optimization through AI analysis for wound care services', 
      icon: CheckCircle, 
      status: 'active',
      color: 'orange',
      modules: ['Claims Dashboard', 'Eligibility Verification', 'Analytics & Forecasting']
    },
    { 
      title: 'Personalize VBC™', 
      description: 'Personalized care interventions perfectly matched to patient preferences and wound care treatment goals', 
      icon: Brain, 
      status: 'active',
      color: 'indigo',
      modules: ['Treatment Plans', 'Patient Engagement', 'Outcome Prediction']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">VBC Super Agent Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <service.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{service.title}</h3>
                  <span className="text-sm text-green-600 font-medium">{service.status}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              
              {/* Modules Preview */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Key Modules:</p>
                <div className="flex flex-wrap gap-1">
                  {service.modules.map((module, moduleIndex) => (
                    <span key={moduleIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {module}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                onClick={() => onToolClick(service.title)}
              >
                Access {service.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VBC Super Agent Dashboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">VBC Super Agent Dashboard</h2>
        
        {/* Alert Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-6">
          <p className="m-0 flex items-center text-sm">
            <span className="font-medium text-blue-700 mr-2">Wound Care Policy Alert:</span>
            Medicare coverage updates for advanced wound care dressings effective January 2025.
            <a href="#" className="ml-2 text-blue-600 underline">Review changes</a>
          </p>
        </div>
        
        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="text-sm text-red-700 font-medium mb-2">Z-Score™ Summary</h4>
            <p className="text-2xl font-bold text-red-700 mb-0">1.59</p>
            <p className="text-xs text-gray-500 mt-1">Wound Complexity Score</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="text-sm text-purple-700 font-medium mb-2">Claims Performance</h4>
            <p className="text-2xl font-bold text-purple-700 mb-0">92.7%</p>
            <p className="text-xs text-gray-500 mt-1">First Pass Resolution Rate</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="text-sm text-green-700 font-medium mb-2">Medication Savings</h4>
            <p className="text-2xl font-bold text-green-700 mb-0">$47</p>
            <p className="text-xs text-gray-500 mt-1">Monthly per Patient</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-sm text-blue-700 font-medium mb-2">Treatment Success</h4>
            <p className="text-2xl font-bold text-blue-700 mb-0">94%</p>
            <p className="text-xs text-gray-500 mt-1">Healing Rate</p>
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-6">
          <h4 className="text-sm text-yellow-700 font-medium mb-2">Recent Alerts</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <p className="m-0">3 patients with chronic wounds need specialist referral</p>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              <p className="m-0">7 wound care certifications due this week</p>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <p className="m-0">New antibiotic formulary changes detected</p>
            </div>
          </div>
        </div>
        
        {/* Tool Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Claims by Wound Type</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diabetic Ulcers</span>
                <span className="text-sm font-medium">487 claims</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pressure Sores</span>
                <span className="text-sm font-medium">312 claims</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Surgical Wounds</span>
                <span className="text-sm font-medium">448 claims</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Specialist Network</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wound Care Specialists</span>
                <span className="text-sm font-medium">23 available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Podiatrists</span>
                <span className="text-sm font-medium">15 available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dermatologists</span>
                <span className="text-sm font-medium">8 available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VBC Super Agent Vision Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 shadow-sm border">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Vision: Healthcare's First Intelligent Care Orchestrator</h2>
          <p className="text-xl text-gray-600 mb-6">"From Fragmented Care to Seamless Health"</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sarah's Story */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Sarah's Story - The Patient Experience
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 italic">
                "Good morning, Sarah! Your AI Care Team has optimized your care plan overnight. We've secured a $47 monthly savings on your medications, scheduled your quarterly check-up with Dr. Chen (who has the best diabetes outcomes in your network), and pre-authorized your annual eye exam. Your personalized health score improved 12 points this month."
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>MedOpti™</strong> analyzed 10,000+ drug pricing scenarios</p>
              <p>• <strong>PolicyPulse™</strong> caught Medicare Part D formulary changes</p>
              <p>• <strong>ReimburseRight™</strong> pre-authorized procedures</p>
              <p>• <strong>AdvocateIQ™</strong> identified top-performing specialists</p>
              <p>• <strong>CLAIMS™</strong> predicted and prevented billing disputes</p>
              <p>• <strong>Personalize VBC™</strong> crafted perfect interventions</p>
            </div>
          </div>

          {/* Dr. Martinez's Reality */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-green-600" />
              Dr. Martinez's Day - The Provider Reality
            </h3>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 italic">
                "Your next patient, James, needs intervention. His diabetes risk score increased 23% based on recent lab trends, his current medication regimen could save $89/month with therapeutic equivalents, and he's eligible for a new diabetes prevention program."
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>73%</strong> reduction in avoidable hospitalizations</p>
              <p>• <strong>18-25%</strong> reduction in per-member-per-month costs</p>
              <p>• <strong>94%</strong> patient satisfaction scores</p>
              <p>• <strong>$2.3M</strong> annual savings per 10,000 lives</p>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
            2030 Success Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">&lt;3%</div>
              <div className="text-sm text-gray-600">Healthcare cost inflation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">60%</div>
              <div className="text-sm text-gray-600">Provider burden reduction</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">&gt;90%</div>
              <div className="text-sm text-gray-600">Patient satisfaction</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">75%</div>
              <div className="text-sm text-gray-600">Hospitalizations prevented</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VBCSuperAgentTools;
