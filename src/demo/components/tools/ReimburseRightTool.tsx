import { useState } from 'react';
import { BarChart2, Calculator, Target, Shield } from 'lucide-react';

const ReimburseRightTool = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Wound care specific Z-Score data
  const zScoreData = [
    {
      id: 1,
      patientId: "WC-28467",
      name: "Sarah Johnson",
      age: 67,
      woundType: "Diabetic Ulcer",
      zScore: 2.8,
      complexity: "High",
      riskLevel: "Critical",
      projectedCost: 124500,
      currentReimbursement: 89200,
      potentialOptimization: 35300,
      status: "Active"
    },
    {
      id: 2,
      patientId: "WC-74538",
      name: "Michael Chen",
      age: 72,
      woundType: "Pressure Sore",
      zScore: 1.9,
      complexity: "Medium",
      riskLevel: "Moderate",
      projectedCost: 87600,
      currentReimbursement: 65400,
      potentialOptimization: 22200,
      status: "Active"
    },
    {
      id: 3,
      patientId: "WC-19234",
      name: "Emily Rodriguez",
      age: 58,
      woundType: "Surgical Wound",
      zScore: 1.2,
      complexity: "Low",
      riskLevel: "Low",
      projectedCost: 43200,
      currentReimbursement: 38900,
      potentialOptimization: 4300,
      status: "Healing"
    }
  ];

  const getZScoreColor = (zScore: number) => {
    if (zScore >= 2.5) return 'bg-red-100 text-red-800';
    if (zScore >= 1.5) return 'bg-orange-100 text-orange-800';
    if (zScore >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Healing': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const totalOptimization = zScoreData.reduce((sum, patient) => sum + patient.potentialOptimization, 0);
  const averageZScore = zScoreData.reduce((sum, patient) => sum + patient.zScore, 0) / zScoreData.length;

  return (
    <div className="font-sans max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-red-600 text-white p-2 rounded-lg mr-3">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-red-700 text-xl font-bold m-0">ReimburseRight™</h1>
            <p className="text-gray-500 text-sm m-0">Wound Care Reimbursement Optimization & Z-Score™ Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">
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
              activeTab === "overview" ? "bg-red-50 text-red-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("zscore")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "zscore" ? "bg-red-50 text-red-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Z-Score™ Analytics
          </button>
          <button 
            onClick={() => setActiveTab("contracts")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "contracts" ? "bg-red-50 text-red-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Contract Tools
          </button>
          <button 
            onClick={() => setActiveTab("preauth")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "preauth" ? "bg-red-50 text-red-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Pre-Authorization
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-6">
                <p className="m-0 flex items-center text-sm">
                  <span className="font-medium text-red-700 mr-2">Optimization Alert:</span>
                  ${totalOptimization.toLocaleString()} in potential reimbursement optimization identified across {zScoreData.length} high-risk wound care patients.
                  <a href="#" className="ml-2 text-red-600 underline">Review opportunities</a>
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="text-sm text-red-700 font-medium mb-2">Z-Score™ Average</h4>
                  <p className="text-2xl font-bold text-red-700 mb-0">{averageZScore.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Patient complexity score</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Optimization Potential</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">${totalOptimization.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all patients</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Pre-Auth Savings</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">$780</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Contract Value</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">$5.95M</p>
                  <p className="text-xs text-gray-500 mt-1">Total contract value</p>
                </div>
              </div>

              {/* Z-Score Distribution */}
              <h3 className="font-medium mb-3">Z-Score™ Distribution</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Patient</th>
                      <th className="p-3 text-left font-medium">Wound Type</th>
                      <th className="p-3 text-left font-medium">Z-Score™</th>
                      <th className="p-3 text-left font-medium">Risk Level</th>
                      <th className="p-3 text-left font-medium">Optimization Potential</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zScoreData.map((patient) => (
                      <tr key={patient.id} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{patient.name}</td>
                        <td className="p-3">{patient.woundType}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getZScoreColor(patient.zScore)}`}>
                            {patient.zScore}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(patient.riskLevel)}`}>
                            {patient.riskLevel}
                          </span>
                        </td>
                        <td className="p-3">${patient.potentialOptimization.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Actions */}
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <Calculator className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">Calculate Z-Score™</span>
                  </div>
                  <p className="text-sm text-gray-600">Generate Z-Score for new patient</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Optimize Contracts</span>
                  </div>
                  <p className="text-sm text-gray-600">Review contract optimization opportunities</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium">Pre-Auth Review</span>
                  </div>
                  <p className="text-sm text-gray-600">Review pending authorizations</p>
                </button>
              </div>
            </>
          )}

          {/* Z-Score Analytics Tab */}
          {activeTab === "zscore" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Z-Score™ Analytics</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="text-sm text-red-700 font-medium mb-2">High Risk Patients</h4>
                  <p className="text-2xl font-bold text-red-700 mb-0">2</p>
                  <p className="text-xs text-gray-500 mt-1">Z-Score ≥ 2.5</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="text-sm text-orange-700 font-medium mb-2">Medium Risk</h4>
                  <p className="text-2xl font-bold text-orange-700 mb-0">1</p>
                  <p className="text-xs text-gray-500 mt-1">Z-Score 1.5-2.4</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Low Risk</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">0</p>
                  <p className="text-xs text-gray-500 mt-1">Z-Score &lt; 1.5</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Detailed Z-Score Analysis</h3>
              <div className="space-y-4">
                {zScoreData.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{patient.name} ({patient.patientId})</h4>
                        <p className="text-sm text-gray-600">{patient.woundType} • Age: {patient.age}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getZScoreColor(patient.zScore)}`}>
                          Z-Score: {patient.zScore}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(patient.riskLevel)}`}>
                          {patient.riskLevel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Projected Cost</p>
                        <p className="text-sm font-medium">${patient.projectedCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Reimbursement</p>
                        <p className="text-sm font-medium">${patient.currentReimbursement.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Optimization Potential</p>
                        <p className="text-sm font-medium text-green-600">${patient.potentialOptimization.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Complexity:</span> {patient.complexity}
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        View Optimization Plan →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contract Tools Tab */}
          {activeTab === "contracts" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Contract Optimization Tools</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Total Contract Value</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">$5.95M</p>
                  <p className="text-xs text-gray-500 mt-1">Across all contracts</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Optimization Potential</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">17.8%</p>
                  <p className="text-xs text-gray-500 mt-1">Average across contracts</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Wound Care Patients</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">492</p>
                  <p className="text-xs text-gray-500 mt-1">Under contract</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Contract Details</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    contractName: "Medicare ACO Contract",
                    type: "Risk-Based",
                    woundCarePatients: 247,
                    totalValue: 2840000,
                    optimizationPotential: 18.5,
                    status: "Active",
                    renewalDate: "2025-12-31"
                  },
                  {
                    id: 2,
                    contractName: "Commercial Payer Agreement",
                    type: "Fee-for-Service",
                    woundCarePatients: 156,
                    totalValue: 1870000,
                    optimizationPotential: 12.3,
                    status: "Active",
                    renewalDate: "2025-06-30"
                  }
                ].map((contract) => (
                  <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{contract.contractName}</h4>
                        <p className="text-sm text-gray-600">{contract.type} • {contract.woundCarePatients} wound care patients</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {contract.optimizationPotential}% potential
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Total Value</p>
                        <p className="text-sm font-medium">${contract.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Optimization Potential</p>
                        <p className="text-sm font-medium text-green-600">${(contract.totalValue * contract.optimizationPotential / 100).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Renewal Date</p>
                        <p className="text-sm font-medium">{new Date(contract.renewalDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Contract Type:</span> {contract.type}
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Optimize Contract →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Authorization Tab */}
          {activeTab === "preauth" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pre-Authorization Management</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Approved</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">2</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h4 className="text-sm text-yellow-700 font-medium mb-2">Pending</h4>
                  <p className="text-2xl font-bold text-yellow-700 mb-0">1</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Avg. Turnaround</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">2.4 days</p>
                  <p className="text-xs text-gray-500 mt-1">Faster than average</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Total Savings</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">$780</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Pre-Authorization Requests</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Patient ID</th>
                      <th className="p-3 text-left font-medium">Service</th>
                      <th className="p-3 text-left font-medium">CPT Code</th>
                      <th className="p-3 text-left font-medium">Requested</th>
                      <th className="p-3 text-left font-medium">Approved</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Turnaround</th>
                      <th className="p-3 text-left font-medium">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        patientId: "WC-28467",
                        service: "Advanced Wound Care Dressing",
                        cptCode: "A2001",
                        requestedAmount: 850,
                        approvedAmount: 680,
                        status: "Approved",
                        turnaroundTime: "2.3 days",
                        savings: 170
                      },
                      {
                        id: 2,
                        patientId: "WC-74538",
                        service: "Hyperbaric Oxygen Therapy",
                        cptCode: "G0277",
                        requestedAmount: 2400,
                        approvedAmount: 1920,
                        status: "Approved",
                        turnaroundTime: "1.8 days",
                        savings: 480
                      },
                      {
                        id: 3,
                        patientId: "WC-19234",
                        service: "Wound Debridement",
                        cptCode: "11042",
                        requestedAmount: 650,
                        approvedAmount: 520,
                        status: "Pending",
                        turnaroundTime: "3.1 days",
                        savings: 130
                      }
                    ].map((auth) => (
                      <tr key={auth.id} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{auth.patientId}</td>
                        <td className="p-3">{auth.service}</td>
                        <td className="p-3">{auth.cptCode}</td>
                        <td className="p-3">${auth.requestedAmount}</td>
                        <td className="p-3">${auth.approvedAmount}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(auth.status)}`}>
                            {auth.status}
                          </span>
                        </td>
                        <td className="p-3">{auth.turnaroundTime}</td>
                        <td className="p-3 text-green-600">${auth.savings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReimburseRightTool;
