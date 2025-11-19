import { useState } from 'react';
import { Users, MessageSquare, Target } from 'lucide-react';

const AdvocateIQTool = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Wound care advocacy campaigns data
  const campaignData = [
    {
      id: 1,
      name: "Medicare Coverage for Advanced Wound Dressings",
      type: "Coverage Expansion",
      status: "Active",
      progress: 78,
      supporters: 12847,
      target: 15000,
      deadline: "2025-06-30",
      impact: "High",
      description: "Advocating for expanded Medicare coverage of advanced wound care dressings including hydrocolloid and foam dressings.",
      keyMilestones: ["Petition launched", "Congressional briefing scheduled", "Coalition formed"],
      nextAction: "Submit formal proposal to CMS"
    },
    {
      id: 2,
      name: "Telehealth Parity for Wound Care Specialists",
      type: "Reimbursement",
      status: "Active",
      progress: 65,
      supporters: 8934,
      target: 12000,
      deadline: "2025-08-15",
      impact: "Medium",
      description: "Ensuring telehealth consultations for wound care receive equivalent reimbursement to in-person visits.",
      keyMilestones: ["Provider survey completed", "Policy brief published"],
      nextAction: "Stakeholder meeting with payers"
    },
    {
      id: 3,
      name: "Wound Care Quality Measure Reform",
      type: "Quality Standards",
      status: "Planning",
      progress: 25,
      supporters: 3256,
      target: 8000,
      deadline: "2025-12-31",
      impact: "High",
      description: "Reforming quality measures to better reflect wound care outcomes and patient-centered care.",
      keyMilestones: ["Expert panel convened"],
      nextAction: "Develop measurement framework"
    }
  ];

  // Coalition partners data
  const coalitionData = [
    {
      id: 1,
      name: "American Association of Wound Care Professionals",
      type: "Professional Association",
      members: 15000,
      influence: "High",
      engagement: "Active",
      contributions: ["Policy expertise", "Member mobilization", "Clinical evidence"]
    },
    {
      id: 2,
      name: "Wound Care Patient Advocacy Network",
      type: "Patient Advocacy",
      members: 8500,
      influence: "Medium",
      engagement: "Active",
      contributions: ["Patient stories", "Grassroots organizing", "Media outreach"]
    },
    {
      id: 3,
      name: "National Association of Wound Care Centers",
      type: "Provider Network",
      members: 450,
      influence: "High",
      engagement: "Moderate",
      contributions: ["Clinical data", "Cost-effectiveness studies", "Provider testimonials"]
    },
    {
      id: 4,
      name: "Diabetic Foot Care Alliance",
      type: "Disease-Specific",
      members: 12000,
      influence: "Medium",
      engagement: "Active",
      contributions: ["Diabetic wound expertise", "Patient education", "Research data"]
    }
  ];

  // Advocacy actions data
  const actionData = [
    {
      id: 1,
      type: "Legislative",
      action: "Congressional Hearing Testimony",
      target: "House Subcommittee on Health",
      date: "2025-04-15",
      status: "Scheduled",
      priority: "High",
      description: "Testify on the importance of wound care coverage reform"
    },
    {
      id: 2,
      type: "Regulatory",
      action: "CMS Comment Submission",
      target: "Centers for Medicare & Medicaid Services",
      date: "2025-03-30",
      status: "In Progress",
      priority: "High",
      description: "Submit comments on proposed wound care reimbursement changes"
    },
    {
      id: 3,
      type: "Grassroots",
      action: "Patient Story Collection",
      target: "General Public",
      date: "2025-05-01",
      status: "Active",
      priority: "Medium",
      description: "Collect and document patient impact stories for advocacy use"
    },
    {
      id: 4,
      type: "Media",
      action: "Press Conference",
      target: "Healthcare Media",
      date: "2025-04-01",
      status: "Planning",
      priority: "Medium",
      description: "Announce coalition findings on wound care access barriers"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
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

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'High': return 'bg-purple-100 text-purple-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const totalSupporters = campaignData.reduce((sum, campaign) => sum + campaign.supporters, 0);
  const activeCampaigns = campaignData.filter(campaign => campaign.status === 'Active').length;
  const totalCoalitionMembers = coalitionData.reduce((sum, partner) => sum + partner.members, 0);

  return (
    <div className="font-sans max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-green-700 text-xl font-bold m-0">AdvocateIQ™</h1>
            <p className="text-gray-500 text-sm m-0">Wound Care Advocacy Campaigns & Coalition Building</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
            Launch Campaign
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
            onClick={() => setActiveTab("campaigns")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "campaigns" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Campaigns
          </button>
          <button 
            onClick={() => setActiveTab("coalition")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "coalition" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Coalition Builder
          </button>
          <button 
            onClick={() => setActiveTab("actions")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "actions" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Action Items
          </button>
          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`w-full text-left p-2 mb-3 rounded transition ${
              activeTab === "analytics" ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50"
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-6">
                <p className="m-0 flex items-center text-sm">
                  <span className="font-medium text-green-700 mr-2">Campaign Update:</span>
                  Medicare Coverage for Advanced Wound Dressings campaign is 78% complete with {campaignData[0].supporters.toLocaleString()} supporters.
                  <a href="#" className="ml-2 text-green-600 underline">View details</a>
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Active Campaigns</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">{activeCampaigns}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently running</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Total Supporters</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">{totalSupporters.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all campaigns</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Coalition Partners</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">{coalitionData.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Active organizations</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="text-sm text-orange-700 font-medium mb-2">Coalition Reach</h4>
                  <p className="text-2xl font-bold text-orange-700 mb-0">{totalCoalitionMembers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Total members</p>
                </div>
              </div>

              {/* Campaign Progress */}
              <h3 className="font-medium mb-3">Campaign Progress</h3>
              <div className="space-y-4 mb-6">
                {campaignData.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{campaign.type} • Deadline: {new Date(campaign.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(campaign.impact)}`}>
                          {campaign.impact} Impact
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{campaign.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Supporters</p>
                        <p className="text-sm font-medium">{campaign.supporters.toLocaleString()} / {campaign.target.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Next Action</p>
                        <p className="text-sm font-medium">{campaign.nextAction}</p>
                      </div>
                    </div>
                    
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      View Campaign Details →
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium">Launch Campaign</span>
                  </div>
                  <p className="text-sm text-gray-600">Start a new advocacy campaign</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Build Coalition</span>
                  </div>
                  <p className="text-sm text-gray-600">Invite new partners to join</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium">Mobilize Supporters</span>
                  </div>
                  <p className="text-sm text-gray-600">Send action alerts to supporters</p>
                </button>
              </div>
            </>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Advocacy Campaigns</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Active Campaigns</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">{activeCampaigns}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently running</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Average Progress</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">
                    {Math.round(campaignData.reduce((sum, c) => sum + c.progress, 0) / campaignData.length)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Across all campaigns</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">High Impact Campaigns</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">
                    {campaignData.filter(c => c.impact === 'High').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Priority campaigns</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Campaign Details</h3>
              <div className="space-y-6">
                {campaignData.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{campaign.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(campaign.impact)}`}>
                          {campaign.impact} Impact
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Campaign Type</p>
                        <p className="text-sm font-medium">{campaign.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Supporters</p>
                        <p className="text-sm font-medium">{campaign.supporters.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="text-sm font-medium">{campaign.target.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-medium">{new Date(campaign.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Key Milestones:</p>
                      <div className="flex flex-wrap gap-2">
                        {campaign.keyMilestones.map((milestone, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {milestone}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Next Action:</span> {campaign.nextAction}
                      </div>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Manage Campaign →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coalition Builder Tab */}
          {activeTab === "coalition" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Coalition Builder</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Partners</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">{coalitionData.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Active organizations</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Total Reach</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">{totalCoalitionMembers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Combined membership</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">High Influence</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">
                    {coalitionData.filter(p => p.influence === 'High').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Key partners</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="text-sm text-orange-700 font-medium mb-2">Active Engagement</h4>
                  <p className="text-2xl font-bold text-orange-700 mb-0">
                    {coalitionData.filter(p => p.engagement === 'Active').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Engaged partners</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Coalition Partners</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Organization</th>
                      <th className="p-3 text-left font-medium">Type</th>
                      <th className="p-3 text-left font-medium">Members</th>
                      <th className="p-3 text-left font-medium">Influence</th>
                      <th className="p-3 text-left font-medium">Engagement</th>
                      <th className="p-3 text-left font-medium">Key Contributions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coalitionData.map((partner) => (
                      <tr key={partner.id} className="border-t border-gray-100">
                        <td className="p-3 font-medium">{partner.name}</td>
                        <td className="p-3">{partner.type}</td>
                        <td className="p-3">{partner.members.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getInfluenceColor(partner.influence)}`}>
                            {partner.influence}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(partner.engagement)}`}>
                            {partner.engagement}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {partner.contributions.slice(0, 2).map((contribution, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {contribution}
                              </span>
                            ))}
                            {partner.contributions.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{partner.contributions.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Items Tab */}
          {activeTab === "actions" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Action Items</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="text-sm text-red-700 font-medium mb-2">High Priority</h4>
                  <p className="text-2xl font-bold text-red-700 mb-0">
                    {actionData.filter(a => a.priority === 'High').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Urgent actions</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Scheduled</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-0">
                    {actionData.filter(a => a.status === 'Scheduled').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Upcoming events</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm text-green-700 font-medium mb-2">In Progress</h4>
                  <p className="text-2xl font-bold text-green-700 mb-0">
                    {actionData.filter(a => a.status === 'In Progress').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Active work</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">This Month</h4>
                  <p className="text-2xl font-bold text-purple-700 mb-0">
                    {actionData.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Due this month</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Upcoming Actions</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Action</th>
                      <th className="p-3 text-left font-medium">Type</th>
                      <th className="p-3 text-left font-medium">Target</th>
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Priority</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionData.map((action) => (
                      <tr key={action.id} className="border-t border-gray-100">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{action.action}</p>
                            <p className="text-xs text-gray-500">{action.description}</p>
                          </div>
                        </td>
                        <td className="p-3">{action.type}</td>
                        <td className="p-3">{action.target}</td>
                        <td className="p-3">{new Date(action.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(action.priority)}`}>
                            {action.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(action.status)}`}>
                            {action.status}
                          </span>
                        </td>
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
              <h2 className="text-xl font-semibold mb-4">Advocacy Analytics</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Campaign Performance</h3>
                  <div className="space-y-3">
                    {campaignData.map((campaign) => (
                      <div key={campaign.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{campaign.name.substring(0, 30)}...</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${campaign.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{campaign.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Coalition Strength</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Influence Partners</span>
                      <span className="text-sm font-medium">
                        {coalitionData.filter(p => p.influence === 'High').length} / {coalitionData.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Engagement</span>
                      <span className="text-sm font-medium">
                        {coalitionData.filter(p => p.engagement === 'Active').length} / {coalitionData.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Reach</span>
                      <span className="text-sm font-medium">{totalCoalitionMembers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Professional Orgs</span>
                      <span className="text-sm font-medium">
                        {coalitionData.filter(p => p.type === 'Professional Association').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-3">Impact Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-green-700 mb-2">Policy Influence</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Public Awareness</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-700 mb-2">Stakeholder Engagement</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium">94%</span>
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

export default AdvocateIQTool;
