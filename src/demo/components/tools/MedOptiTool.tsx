import { useState } from 'react';

const MedOptiTool = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Wound care medications data
  const woundCareDrugs = [
    { 
      name: "Silver Sulfadiazine Cream", 
      currentPrice: 85, 
      negotiatedPrice: 51, 
      savingsPercent: 40.0,
      category: "Antibiotic",
      woundType: "Burn Wounds"
    },
    { 
      name: "Hydrocolloid Dressing", 
      currentPrice: 125, 
      negotiatedPrice: 88, 
      savingsPercent: 29.6,
      category: "Dressing",
      woundType: "Pressure Ulcers"
    },
    { 
      name: "Alginate Dressing", 
      currentPrice: 210, 
      negotiatedPrice: 137, 
      savingsPercent: 34.8,
      category: "Dressing",
      woundType: "Diabetic Ulcers"
    }
  ];
  
  const totalSavings = woundCareDrugs.reduce((sum, drug) => sum + (drug.currentPrice - drug.negotiatedPrice), 0);
  const averageSavingsPercent = woundCareDrugs.reduce((sum, drug) => sum + drug.savingsPercent, 0) / woundCareDrugs.length;
  
  return (
    <div className="font-sans max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-blue-700 text-xl font-bold m-0">MedOpti™ Wound Care</h1>
            <p className="text-gray-500 text-sm m-0">Wound Care Medication Optimization & Savings Analysis</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          Generate Report
        </button>
      </header>
      
      {/* Main Content */}
      <div className="flex gap-4">
        {/* Navigation */}
        <nav className="w-56 bg-white rounded-lg shadow p-4 h-fit">
          {["overview", "savings", "formulary", "antibiotics", "resources"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left p-2 mb-3 rounded transition ${
                activeTab === tab 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        
        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {activeTab === "overview" && (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-6">
                <p className="m-0 flex items-center text-sm">
                  <span className="font-medium text-blue-700 mr-2">Wound Care Medication Update:</span>
                  New Medicare negotiated prices for wound care medications effective January 1, 2026.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Projected Savings</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">${totalSavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Per wound care patient annually</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Average Discount</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">{averageSavingsPercent.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Across wound care medications</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Formulary Optimization</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">85%</p>
                  <p className="text-xs text-gray-500 mt-1">Cost-effective alternatives available</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-3">Negotiated Wound Care Medications</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Medication</th>
                      <th className="p-3 text-left font-medium">Category</th>
                      <th className="p-3 text-left font-medium">Wound Type</th>
                      <th className="p-3 text-left font-medium">Current Price</th>
                      <th className="p-3 text-left font-medium">Negotiated Price</th>
                      <th className="p-3 text-left font-medium">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {woundCareDrugs.map((drug, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{drug.name}</td>
                        <td className="p-3">{drug.category}</td>
                        <td className="p-3">{drug.woundType}</td>
                        <td className="p-3">${drug.currentPrice}</td>
                        <td className="p-3">${drug.negotiatedPrice}</td>
                        <td className="p-3">{drug.savingsPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === "savings" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Wound Care Savings Analysis</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-blue-700 mb-2">Patient Impact Calculator</h3>
                <p className="mb-4">Calculate potential savings for your wound care patient population.</p>
                <div className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Wound Care Patients</label>
                      <input type="number" defaultValue="150" className="w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Medications per Patient</label>
                      <input type="number" defaultValue="3" className="w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Treatment Duration (months)</label>
                      <input type="number" defaultValue="6" className="w-full border border-gray-300 rounded p-2" />
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                    Calculate Organization Savings
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "formulary" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Wound Care Formulary Optimization</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm">Optimize your wound care formulary with cost-effective alternatives that maintain clinical efficacy.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-green-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Silver Sulfadiazine → Silver Alginate</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">$34 savings</span>
                  </div>
                </div>
                <div className="p-3 border-b border-gray-100 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hydrocolloid → Foam Dressing</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">$37 savings</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Collagen Matrix → Collagen Powder</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">$69 savings</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "antibiotics" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Antibiotic Optimization for Wound Care</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm">Optimize antibiotic selection for wound infections while reducing costs and preventing resistance.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Mild Infection</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Topical</span>
                  </div>
                  <p className="text-xs text-gray-600">Silver sulfadiazine cream → $34 savings</p>
                </div>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Moderate Infection</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Oral</span>
                  </div>
                  <p className="text-xs text-gray-600">Cephalexin → $12 savings</p>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Severe Infection</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">IV</span>
                  </div>
                  <p className="text-xs text-gray-600">Vancomycin → $89 savings</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "resources" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Wound Care Medication Resources</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm">Access key resources for wound care medication optimization and cost management.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                  <h4 className="font-medium text-blue-700 mb-2">Clinical Guidelines</h4>
                  <ul className="list-disc pl-4 mb-0 text-sm">
                    <li className="mb-2"><a href="#" className="text-blue-600">Wound Care Medication Guidelines</a></li>
                    <li className="mb-2"><a href="#" className="text-blue-600">Antibiotic Stewardship in Wound Care</a></li>
                    <li><a href="#" className="text-blue-600">Cost-Effective Dressing Selection</a></li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                  <h4 className="font-medium text-blue-700 mb-2">Implementation Tools</h4>
                  <ul className="list-disc pl-4 mb-0 text-sm">
                    <li className="mb-2"><a href="#" className="text-blue-600">Formulary Update Checklist</a></li>
                    <li className="mb-2"><a href="#" className="text-blue-600">Staff Training Modules</a></li>
                    <li><a href="#" className="text-blue-600">Patient Education Materials</a></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedOptiTool;
