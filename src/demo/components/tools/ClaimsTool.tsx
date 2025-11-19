import { useState } from 'react';
import { FileText, AlertTriangle, Eye } from 'lucide-react';

const ClaimsTool = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Wound care claims data
  const claimsData = [
    {
      id: 1,
      claimNumber: "WC-2025-001247",
      patientId: "WC-28467",
      patientName: "Sarah Johnson",
      service: "Advanced Wound Care Dressing Application",
      cptCode: "A2001",
      submittedAmount: 850,
      paidAmount: 680,
      status: "Paid",
      payer: "Medicare",
      submissionDate: "2025-01-15",
      daysToPayment: 13
    },
    {
      id: 2,
      claimNumber: "WC-2025-001248",
      patientId: "WC-74538",
      patientName: "Michael Chen",
      service: "Hyperbaric Oxygen Therapy",
      cptCode: "G0277",
      submittedAmount: 2400,
      paidAmount: 1920,
      status: "Paid",
      payer: "Medicare",
      submissionDate: "2025-01-16",
      daysToPayment: 14
    },
    {
      id: 3,
      claimNumber: "WC-2025-001249",
      patientId: "WC-19234",
      patientName: "Emily Rodriguez",
      service: "Wound Debridement",
      cptCode: "11042",
      submittedAmount: 650,
      paidAmount: 0,
      status: "Denied",
      payer: "Medicare",
      submissionDate: "2025-01-17",
      daysToPayment: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayerColor = (payer: string) => {
    switch (payer) {
      case 'Medicare': return 'bg-blue-100 text-blue-800';
      case 'Medicaid': return 'bg-green-100 text-green-800';
      case 'Commercial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const totalClaims = claimsData.length;
  const paidClaims = claimsData.filter(claim => claim.status === 'Paid').length;
  const deniedClaims = claimsData.filter(claim => claim.status === 'Denied').length;
  const totalSubmitted = claimsData.reduce((sum, claim) => sum + claim.submittedAmount, 0);
  const totalPaid = claimsData.reduce((sum, claim) => sum + (claim.paidAmount || 0), 0);
  const avgDaysToPayment = claimsData
    .filter(claim => claim.daysToPayment)
    .reduce((sum, claim) => sum + claim.daysToPayment!, 0) / claimsData.filter(claim => claim.daysToPayment).length;

  return (
    <div className="font-sans max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-purple-600 text-white p-2 rounded-lg mr-3">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-purple-700 text-xl font-bold m-0">CLAIMS™</h1>
            <p className="text-gray-500 text-sm m-0">All-Payer Wound Care Claims Management & Clearinghouse</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
            Process Claims
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
              activeTab === "overview" ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("claims")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "claims" ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Claims Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("eligibility")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "eligibility" ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Eligibility Verification
          </button>
          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "analytics" ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Analytics & Forecasting
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mb-6">
                <p className="m-0 flex items-center text-sm">
                  <span className="font-medium text-purple-700 mr-2">Claims Alert:</span>
                  {deniedClaims} claims require attention.
                  <a href="#" className="ml-2 text-purple-600 underline">Review denials</a>
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Total Claims</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">{totalClaims}</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Paid Claims</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">{paidClaims}</p>
                  <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Avg. Days to Payment</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">{avgDaysToPayment.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Faster than industry average</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="text-sm text-orange-700 font-medium mb-2">Collection Rate</h4>
                  <p className="text-2xl font-bold text-orange-700 mb-0">
                    {((totalPaid / totalSubmitted) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Revenue collected</p>
                </div>
              </div>

              {/* Recent Claims */}
              <h3 className="font-medium mb-3">Recent Claims</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Claim #</th>
                      <th className="p-3 text-left font-medium">Patient</th>
                      <th className="p-3 text-left font-medium">Service</th>
                      <th className="p-3 text-left font-medium">Submitted</th>
                      <th className="p-3 text-left font-medium">Paid</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Payer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimsData.map((claim) => (
                      <tr key={claim.id} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{claim.claimNumber}</td>
                        <td className="p-3">{claim.patientName}</td>
                        <td className="p-3">{claim.service}</td>
                        <td className="p-3">${claim.submittedAmount}</td>
                        <td className="p-3">${claim.paidAmount || 0}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPayerColor(claim.payer)}`}>
                            {claim.payer}
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
                    <FileText className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium">Submit Claims</span>
                  </div>
                  <p className="text-sm text-gray-600">Batch submit new claims</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Verify Eligibility</span>
                  </div>
                  <p className="text-sm text-gray-600">Check patient coverage</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">Review Denials</span>
                  </div>
                  <p className="text-sm text-gray-600">Address denied claims</p>
                </button>
              </div>
            </>
          )}

          {/* Claims Dashboard Tab */}
          {activeTab === "claims" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Claims Dashboard</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Paid Claims</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">{paidClaims}</p>
                  <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h4 className="text-sm text-yellow-700 font-medium mb-2">Pending Claims</h4>
                  <p className="text-2xl font-bold text-yellow-700 mb-0">0</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="text-sm text-red-700 font-medium mb-2">Denied Claims</h4>
                  <p className="text-2xl font-bold text-red-700 mb-0">{deniedClaims}</p>
                  <p className="text-xs text-gray-500 mt-1">Require attention</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">First Pass Rate</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">
                    {((paidClaims / totalClaims) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Claims paid on first submission</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Claims by Status</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Count</th>
                      <th className="p-3 text-left font-medium">Percentage</th>
                      <th className="p-3 text-left font-medium">Total Amount</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { status: 'Paid', count: paidClaims, amount: totalPaid },
                      { status: 'Pending', count: 0, amount: 0 },
                      { status: 'Denied', count: deniedClaims, amount: claimsData.filter(c => c.status === 'Denied').reduce((sum, c) => sum + c.submittedAmount, 0) }
                    ].map((item) => (
                      <tr key={item.status} className="border-t border-gray-100">
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 font-medium">{item.count}</td>
                        <td className="p-3">{((item.count / totalClaims) * 100).toFixed(1)}%</td>
                        <td className="p-3">${item.amount.toLocaleString()}</td>
                        <td className="p-3">
                          <button className="text-purple-600 hover:text-purple-700 text-sm">
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Eligibility Verification Tab */}
          {activeTab === "eligibility" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Eligibility Verification</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Active Coverage</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">3</p>
                  <p className="text-xs text-gray-500 mt-1">Patients with active coverage</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Medicare Patients</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">2</p>
                  <p className="text-xs text-gray-500 mt-1">Medicare beneficiaries</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Commercial Patients</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">1</p>
                  <p className="text-xs text-gray-500 mt-1">Commercial insurance</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="text-sm text-orange-700 font-medium mb-2">Deductible Met</h4>
                  <p className="text-2xl font-bold text-orange-700 mb-0">1</p>
                  <p className="text-xs text-gray-500 mt-1">Patients with met deductibles</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Patient Eligibility Status</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Patient</th>
                      <th className="p-3 text-left font-medium">Payer</th>
                      <th className="p-3 text-left font-medium">Coverage Type</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Deductible</th>
                      <th className="p-3 text-left font-medium">Copay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        patientName: "Sarah Johnson",
                        payer: "Medicare",
                        coverageType: "Part B",
                        status: "Active",
                        deductible: "$180 / $240",
                        copay: "$20"
                      },
                      {
                        patientName: "Michael Chen",
                        payer: "Medicare",
                        coverageType: "Part B",
                        status: "Active",
                        deductible: "$240 / $240",
                        copay: "$20"
                      },
                      {
                        patientName: "Emily Rodriguez",
                        payer: "Commercial",
                        coverageType: "PPO",
                        status: "Active",
                        deductible: "$1200 / $1500",
                        copay: "$25"
                      }
                    ].map((eligibility, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{eligibility.patientName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPayerColor(eligibility.payer)}`}>
                            {eligibility.payer}
                          </span>
                        </td>
                        <td className="p-3">{eligibility.coverageType}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {eligibility.status}
                          </span>
                        </td>
                        <td className="p-3">{eligibility.deductible}</td>
                        <td className="p-3">{eligibility.copay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Analytics & Forecasting</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Claims by Status</h3>
                  <div className="space-y-3">
                    {[
                      { status: 'Paid', percentage: 66.7 },
                      { status: 'Pending', percentage: 0 },
                      { status: 'Denied', percentage: 33.3 }
                    ].map((item) => (
                      <div key={item.status} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.status === 'Paid' ? 'bg-green-600' : 
                                item.status === 'Pending' ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Top Denial Reasons</h3>
                  <div className="space-y-3">
                    {[
                      { reason: 'Medical necessity not established', percentage: 100 }
                    ].map((item) => (
                      <div key={item.reason} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.reason}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-green-700 mb-2">First Pass Resolution Rate</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '66.7%' }}></div>
                    </div>
                    <span className="text-sm font-medium">66.7%</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Average Days to Payment</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                    <span className="text-sm font-medium">13.5 days</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-700 mb-2">Collection Rate</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78.3%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78.3%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimsTool;
