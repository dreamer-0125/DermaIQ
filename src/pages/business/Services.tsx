import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Users, Truck, CheckCircle, Heart, Shield, Wifi } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Services = () => {
  const serviceCategories = [
    {
      id: 'core-services',
      title: 'Core Services',
      description: 'Comprehensive wound care services powered by AI technology and clinical expertise',
      icon: <Brain className="h-8 w-8 text-[#3681DE]" />,
      features: ['AI wound measurement', 'Infection detection', 'Chronic wound management', 'Post-surgical care'],
      color: 'blue',
      services: [
        { name: 'AI Wound Measurement', path: '/services/ai-wound-measurement' },
        { name: 'Infection Detection & Management', path: '/services/infection-detection' },
        { name: 'Chronic Wound Management', path: '/services/chronic-wound-management' },
        { name: 'Surgical Wound Care', path: '/services/surgical-wound-care' },
        { name: 'Patient Education', path: '/services/patient-education' }
      ]
    },
    {
      id: 'care-navigation',
      title: 'Care Navigation',
      description: 'Seamless coordination and referral management for optimal patient outcomes',
      icon: <Users className="h-8 w-8 text-[#3681DE]" />,
      features: ['Care coordination', 'Specialist referrals', 'Team communication', 'Patient engagement'],
      color: 'teal',
      services: [
        { name: 'Care Coordination', path: '/services/care-coordination' },
        { name: 'Referral Management', path: '/services/referral-management' }
      ]
    },
    {
      id: 'delivery-channels',
      title: 'Delivery Channels',
      description: 'Flexible care delivery options to meet your organization\'s unique needs',
      icon: <Truck className="h-8 w-8 text-[#3681DE]" />,
      features: ['Onsite clinics', 'Mobile units', 'Virtual care', 'Community access'],
      color: 'green',
      services: [
        { name: 'Onsite Clinic', path: '/services/onsite-clinic' },
        { name: 'Nearsite Clinic', path: '/services/nearsite-clinic' },
        { name: 'Mobile Unit', path: '/services/mobile-unit' },
        { name: 'Virtual Care', path: '/services/virtual-care' }
      ]
    }
  ];

  const hybridCareFeatures = [
    {
      icon: <Heart className="h-6 w-6 text-[#3681DE]" />,
      title: 'Holistic Approach',
      description: 'We integrate medical, behavioral, and social care'
    },
    {
      icon: <Brain className="h-6 w-6 text-[#3681DE]" />,
      title: 'Tech-Enabled, Human-Centered',
      description: 'Advanced technology enhances, not replaces, personal care'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3681DE]" />,
      title: 'Proven Results',
      description: 'Our model reduces hospital readmissions and improves patient well-being'
    },
    {
      icon: <Wifi className="h-6 w-6 text-[#3681DE]" />,
      title: 'Seamless Integration',
      description: 'Virtual and in-home care coordination'
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>DermaIQ Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
            Comprehensive wound care services organized into three main categories:
            Core Services, Care Navigation, and Delivery Channels - all designed to transform healthcare delivery
            through our innovative hybrid care model.
          </p>
        </div>

        {/* Hybrid Care Model */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 mb-16 animate-slideInLeft">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Hybrid Care Model</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
              We are dedicated to improving the lives of polychronic patients and those with complex care needs
              through a seamless hybrid model of virtual and in-home care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hybridCareFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:scale-110 transition-all duration-200 animate-zoomIn" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature.title}</h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Integration */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 mb-16 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Integrated Service Approach</h2>
            <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
              Our services work together seamlessly to provide comprehensive wound care solutions.
              Mix and match services from different categories to create the perfect care model for your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-110 transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <Brain className="h-8 w-8 text-[#3681DE] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Core Services</h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Foundation of clinical excellence</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-110 transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <Users className="h-8 w-8 text-[#3681DE] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Care Navigation</h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Seamless care coordination</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-110 transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <Truck className="h-8 w-8 text-[#3681DE] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Delivery Channels</h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Flexible care delivery options</p>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="space-y-16">
          {serviceCategories.map((category, categoryIndex) => (
            <div key={category.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:scale-105 transition-all duration-200 animate-flash" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
              <div className="mb-8">
                <img
                  src={`https://images.unsplash.com/photo-${category.id === 'core-services' ? '1522071820081-009f0129c71c' :
                    category.id === 'care-navigation' ? '1522071820081-009f0129c71c' :
                      '1612349317150-e3d4b83c1d4f'
                    }?auto=format&fit=crop&w=800&q=80`}
                  alt={`${category.title} healthcare services`}
                  className="w-full h-64 object-cover rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <div className={`inline-flex p-3 rounded-lg bg-${category.color}-50 mb-4`}>
                    {category.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{category.title}</h2>
                  <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{category.description}</p>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Key Features:</h3>
                    <ul className="space-y-2">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <CheckCircle className="h-4 w-4 text-[#3681DE] mr-2" />
                          <span className="text-sm" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Individual Services */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Available Services:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.services.map((service, serviceIndex) => (
                    <Link
                      key={serviceIndex}
                      to={service.path}
                      className={`flex items-center justify-between p-4 bg-${category.color}-50 rounded-lg hover:bg-${category.color}-100 transition-colors border border-${category.color}-200 hover:scale-105 transition-all duration-200`}
                    >
                      <span className="font-medium text-gray-900" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{service.name}</span>
                      <ArrowRight className={`h-4 w-4 text-[#3681DE]`} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center mt-16 text-center animate-wiggle">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Design Your Custom Service Mix</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
            Ready to create a wound care solution tailored to your organization?
            Let's discuss which combination of services will deliver the best outcomes for your patients
            through our hybrid care model.
          </p>
          <button className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            Schedule Consultation
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;