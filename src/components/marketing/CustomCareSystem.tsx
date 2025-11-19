import { useState } from 'react';
import { Check, Plus, Brain, Smartphone, Users, FileText, Shield, Zap } from 'lucide-react';

const CustomCareSystem = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>(['primary-measurement']);
  const [selectedNavigation, setSelectedNavigation] = useState<string[]>(['basic-support']);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleNavigation = (navId: string) => {
    setSelectedNavigation(prev => 
      prev.includes(navId) 
        ? prev.filter(id => id !== navId)
        : [...prev, navId]
    );
  };

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const coreServices = [
    {
      id: 'primary-measurement',
      name: 'AI Wound Measurement',
      description: 'Preventive, chronic, acute, and routine wound assessment',
      status: 'included',
      icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'infection-detection',
      name: 'Infection Detection & Management',
      description: 'Advanced imaging and infection risk assessment protocols',
      status: 'optional',
      icon: <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'chronic-care',
      name: 'Chronic Wound Management',
      description: 'Specialized protocols for diabetic ulcers, pressure injuries, and venous wounds',
      status: 'optional',
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'surgical-wounds',
      name: 'Post-Surgical Wound Care',
      description: 'Monitoring and management of surgical site healing and complications',
      status: 'optional',
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'patient-education',
      name: 'Patient Education & Self-Care',
      description: 'Digital wound care education, self-monitoring tools, and behavioral health support',
      status: 'optional',
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />
    }
  ];

  const navigationServices = [
    {
      id: 'basic-support',
      name: 'Care Coordination',
      description: 'Scheduling, wound tracking, and care team communication',
      status: 'included',
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'referral-management',
      name: 'Specialist Referral Management',
      description: 'White-glove referrals to in-network, high-quality wound care specialists and advanced treatment centers',
      status: 'optional',
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
    }
  ];

  const deliveryChannels = [
    {
      id: 'onsite-clinic',
      name: 'Onsite Wound Care',
      description: 'Private, branded wound care center at your organization\'s location',
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'nearsite-clinic',
      name: 'Nearsite Clinic',
      description: 'Shared or dedicated DermaIQ clinics located within community reach',
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'mobile-unit',
      name: 'Mobile Wound Care Unit',
      description: 'Compact, mobile wound care services brought directly to your facility',
      icon: <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
    },
    {
      id: 'virtual-care',
      name: 'Virtual Wound Assessment',
      description: '24/7 access to DermaIQ\'s National Wound Care Team via telehealth platform',
      icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
    }
  ];

  const includedFeatures = [
    { icon: <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'DermaIQ App – Patient access to wound care, anywhere' },
    { icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Patient Engagement – Proactive outreach & two-way communication' },
    { icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Treatment Coordination – In-house or partner specialist alignment' },
    { icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Clinical Oversight – Wound care protocols, quality, staffing' },
    { icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Self-Care Hub – Digital content & behavioral health tools' },
    { icon: <Zap className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Diagnostic Support – AI analysis for timely clinical decisions' },
    { icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Population Health – Data-driven insights on wound healing trends' },
    { icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Account Management – A dedicated team to support your organization' },
    { icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />, text: 'Reporting and Insights – Real-time performance and outcomes dashboards' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-200">
            Co-Design Your Solution
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Build Your Custom Wound Care System
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">with Co-Design by DermaIQ</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Design the wound care model that fits your organization. Choose your ideal combination of Core Services, 
            Care Navigation, and Delivery Channels—powered by the DermaIQ platform and supported by our clinical and operational infrastructure.
          </p>
        </div>

        {/* Partnership Approach */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8 sm:mb-12 border border-blue-100">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Co-Design Partnership Approach</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              We don't just provide technology—we partner with you to design, implement, and optimize a wound care solution that delivers measurable results for your organization.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl">
              <div className="bg-blue-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Discovery & Strategy</h4>
              <p className="text-xs sm:text-sm text-gray-600">We analyze your current workflows and identify optimization opportunities</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-teal-50 rounded-xl">
              <div className="bg-teal-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Custom Configuration</h4>
              <p className="text-xs sm:text-sm text-gray-600">Together, we design your ideal combination of services and delivery channels</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-green-50 rounded-xl sm:col-span-2 lg:col-span-1">
              <div className="bg-green-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Implementation & Support</h4>
              <p className="text-xs sm:text-sm text-gray-600">Dedicated team ensures smooth rollout and ongoing optimization</p>
            </div>
          </div>
        </div>

        {/* Included Features */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8 sm:mb-12 border border-blue-100">
          <div className="mb-4 sm:mb-6">
            <img 
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80" 
              alt="Comprehensive healthcare platform and AI-powered medical systems"
              className="w-full h-32 sm:h-48 object-cover rounded-xl shadow-md"
            />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 sm:mr-3" />
            Included in Every DermaIQ Co-Design System:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 mr-2 sm:mr-3">{feature.icon}</div>
                <span className="text-gray-700 text-xs sm:text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Core Services */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-6 sm:mb-8 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="bg-blue-600 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm font-bold">1</div>
            Choose Your Core Wound Care Services
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">AI Wound Measurement is always included. Select additional services that meet your population's wound care needs:</p>
          
          {/* Mobile-friendly card layout */}
          <div className="space-y-4 lg:hidden">
            {coreServices.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-blue-600 mr-3">{service.icon}</div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{service.name}</span>
                  </div>
                  {service.status === 'included' ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs sm:text-sm font-medium">Included</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        selectedServices.includes(service.id)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {selectedServices.includes(service.id) ? 'Added' : 'Add'}
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {coreServices.map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-3">{service.icon}</div>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{service.description}</td>
                    <td className="py-4 px-4">
                      {service.status === 'included' ? (
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Included</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedServices.includes(service.id)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                          }`}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {selectedServices.includes(service.id) ? 'Added' : 'Add to Plan'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2: Care Navigation */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-6 sm:mb-8 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="bg-teal-600 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm font-bold">2</div>
            Add Care Navigation Services
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Care Coordination is standard. Add Specialist Referral Management for high-quality wound care alignment:</p>
          
          {/* Mobile-friendly card layout */}
          <div className="space-y-4 lg:hidden">
            {navigationServices.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-teal-600 mr-3">{service.icon}</div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{service.name}</span>
                  </div>
                  {service.status === 'included' ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs sm:text-sm font-medium">Included</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleNavigation(service.id)}
                      className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        selectedNavigation.includes(service.id)
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-teal-50'
                      }`}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {selectedNavigation.includes(service.id) ? 'Added' : 'Add'}
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {navigationServices.map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="text-teal-600 mr-3">{service.icon}</div>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{service.description}</td>
                    <td className="py-4 px-4">
                      {service.status === 'included' ? (
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Included</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleNavigation(service.id)}
                          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedNavigation.includes(service.id)
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-teal-50'
                          }`}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {selectedNavigation.includes(service.id) ? 'Added' : 'Add to Plan'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 3: Delivery Channels */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8 sm:mb-12 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="bg-green-600 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm font-bold">3</div>
            Select Your Care Delivery Channels
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Choose at least one care delivery channel. You can select multiple options:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {deliveryChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => toggleChannel(channel.id)}
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedChannels.includes(channel.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-2 sm:mr-3">{channel.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{channel.name}</h4>
                  </div>
                  <button
                    className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      selectedChannels.includes(channel.id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {selectedChannels.includes(channel.id) ? 'Added' : 'Add'}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Your Custom Quote
          </button>
          <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4">Speak with our team to design your perfect wound care solution</p>
        </div>
      </div>
    </section>
  );
};

export default CustomCareSystem;