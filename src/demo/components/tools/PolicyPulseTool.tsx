import { useState } from 'react';
import { AlertTriangle, Eye } from 'lucide-react';

const PolicyPulseTool = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Wound care specific policy data
  const woundCarePolicies = [
    {
      id: 1,
      title: "Medicare Coverage for Advanced Wound Care Dressings",
      category: "Coverage",
      status: "Active",
      impact: "High",
      effectiveDate: "2025-01-01",
      description: "Expanded coverage for advanced wound care dressings including cellular and tissue-based products for diabetic ulcers",
      affectedCodes: ["A2001", "A2002", "A2003"],
      estimatedImpact: "$47M annual savings",
      states: ["All States"],
      priority: "Critical"
    },
    {
      id: 2,
      title: "Telehealth Wound Care Consultation Guidelines",
      category: "Telehealth",
      status: "Pending",
      impact: "Medium",
      effectiveDate: "2025-03-15",
      description: "New guidelines for telehealth wound care consultations and remote monitoring protocols",
      affectedCodes: ["99441", "99442", "99443"],
      estimatedImpact: "$12M additional revenue",
      states: ["California", "Texas", "Florida", "New York"],
      priority: "High"
    },
    {
      id: 3,
      title: "Antibiotic Stewardship in Wound Care",
      category: "Clinical",
      status: "Active",
      impact: "High",
      effectiveDate: "2024-11-01",
      description: "Mandatory antibiotic stewardship protocols for wound care treatment and infection management",
      affectedCodes: ["J0120", "J0121", "J0122"],
      estimatedImpact: "$18M cost reduction",
      states: ["All States"],
      priority: "Critical"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-green-700 text-xl font-bold m-0">PolicyPulse™</h1>
            <p className="text-gray-500 text-sm m-0">Wound Care Policy Monitoring & Impact Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
            Generate Report
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Navigation */}
        <nav className="w-56 bg-white rounded-lg shadow p-4 h-fit">
          <button 
            onClick={() => setActiveTab("overview")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "overview" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("policies")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "policies" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Active Policies
          </button>
          <button 
            onClick={() => setActiveTab("impact")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "impact" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Impact Analysis
          </button>
          <button 
            onClick={() => setActiveTab("compliance")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "compliance" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            State Compliance
          </button>
          <button 
            onClick={() => setActiveTab("alerts")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "alerts" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Policy Alerts
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-6">
                <p className="m-0 flex items-center text-sm">
                  <span className="font-medium text-green-700 mr-2">Policy Alert:</span>
                  Medicare coverage updates for advanced wound care dressings effective January 1, 2025.
                  <a href="#" className="ml-2 text-green-600 underline">Review changes</a>
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Active Policies</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">12</p>
                  <p className="text-xs text-gray-500 mt-1">Wound care specific</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Compliance Rate</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">94%</p>
                  <p className="text-xs text-gray-500 mt-1">Across all states</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Impact Score</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">8.7/10</p>
                  <p className="text-xs text-gray-500 mt-1">High impact policies</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="text-sm text-orange-700 font-medium mb-2">Pending Changes</h4>
                  <p className="text-2xl font-bold text-orange-700 mb-0">3</p>
                  <p className="text-xs text-gray-500 mt-1">Require attention</p>
                </div>
              </div>

              {/* Recent Policy Changes */}
              <h3 className="font-medium mb-3">Recent Wound Care Policy Changes</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Policy</th>
                      <th className="p-3 text-left font-medium">Category</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Impact</th>
                      <th className="p-3 text-left font-medium">Effective Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {woundCarePolicies.map((policy) => (
                      <tr key={policy.id} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{policy.title}</td>
                        <td className="p-3">{policy.category}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(policy.impact)}`}>
                            {policy.impact}
                          </span>
                        </td>
                        <td className="p-3">{new Date(policy.effectiveDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Active Policies Tab */}
          {activeTab === "policies" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Wound Care Policies</h2>
              
              <div className="space-y-4">
                {woundCarePolicies.map((policy) => (
                  <div key={policy.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{policy.title}</h3>
                        <p className="text-sm text-gray-600">{policy.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(policy.priority)}`}>
                          {policy.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(policy.status)}`}>
                          {policy.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-sm font-medium">{policy.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Impact</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(policy.impact)}`}>
                          {policy.impact}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Effective Date</p>
                        <p className="text-sm font-medium">{new Date(policy.effectiveDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Estimated Impact</p>
                        <p className="text-sm font-medium">{policy.estimatedImpact}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Affected Codes: {policy.affectedCodes.join(", ")}</span>
                        <span>States: {policy.states.join(", ")}</span>
                      </div>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact Analysis Tab */}
          {activeTab === "impact" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Policy Impact Analysis</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Coverage Impact</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">94%</p>
                  <p className="text-xs text-gray-500 mt-1">Positive impact on coverage</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Cost Impact</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">+$47M</p>
                  <p className="text-xs text-gray-500 mt-1">Annual savings projected</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Quality Impact</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">90%</p>
                  <p className="text-xs text-gray-500 mt-1">Improved outcomes</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Impact Trends by Category</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Coverage Policies</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Positive Impact</span>
                        <span className="text-green-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Telehealth</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Adoption Rate</span>
                        <span className="text-blue-600">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Quality Measures</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compliance</span>
                        <span className="text-purple-600">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Savings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Realized</span>
                        <span className="text-orange-600">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* State Compliance Tab */}
          {activeTab === "compliance" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">State Compliance Overview</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Overall Compliance</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">94%</p>
                  <p className="text-xs text-gray-500 mt-1">Average across states</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">States Monitored</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">50</p>
                  <p className="text-xs text-gray-500 mt-1">All states + DC</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Last Updated</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">Today</p>
                  <p className="text-xs text-gray-500 mt-1">Real-time monitoring</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">State Compliance Details</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">State</th>
                      <th className="p-3 text-left font-medium">Compliance Rate</th>
                      <th className="p-3 text-left font-medium">Active Policies</th>
                      <th className="p-3 text-left font-medium">Last Update</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { state: "California", compliance: 94, policies: 12, lastUpdate: "2025-01-15" },
                      { state: "Texas", compliance: 89, policies: 10, lastUpdate: "2025-01-12" },
                      { state: "Florida", compliance: 91, policies: 11, lastUpdate: "2025-01-14" },
                      { state: "New York", compliance: 96, policies: 13, lastUpdate: "2025-01-16" }
                    ].map((state, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{state.state}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className="mr-2">{state.compliance}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  state.compliance >= 90 ? 'bg-green-500' : 
                                  state.compliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${state.compliance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{state.policies}</td>
                        <td className="p-3">{new Date(state.lastUpdate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            state.compliance >= 90 ? 'bg-green-100 text-green-800' : 
                            state.compliance >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {state.compliance >= 90 ? 'Compliant' : 
                             state.compliance >= 80 ? 'At Risk' : 'Non-Compliant'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Policy Alerts Tab */}
          {activeTab === "alerts" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Policy Alerts</h2>
              
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: "Critical",
                    title: "Medicare Coverage Update Effective Immediately",
                    message: "New coverage for advanced wound care dressings is now active. Update your billing systems immediately.",
                    time: "2 hours ago",
                    read: false
                  },
                  {
                    id: 2,
                    type: "High",
                    title: "Telehealth Guidelines Published",
                    message: "CMS has published new telehealth guidelines for wound care consultations.",
                    time: "1 day ago",
                    read: false
                  },
                  {
                    id: 3,
                    type: "Medium",
                    title: "Quality Reporting Deadline Approaching",
                    message: "Q1 2025 wound care quality reporting is due in 2 weeks.",
                    time: "3 days ago",
                    read: true
                  }
                ].map((alert) => (
                  <div key={alert.id} className={`border-l-4 p-4 rounded-r-lg ${
                    alert.type === 'Critical' ? 'border-red-500 bg-red-50' :
                    alert.type === 'High' ? 'border-orange-500 bg-orange-50' :
                    'border-yellow-500 bg-yellow-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${
                          alert.type === 'Critical' ? 'text-red-500' :
                          alert.type === 'High' ? 'text-orange-500' :
                          'text-yellow-500'
                        }`} />
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{alert.time}</span>
                            {!alert.read && (
                              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full">New</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyPulseTool;
