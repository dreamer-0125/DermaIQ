import { Shield, MessageSquare, Calendar, Users, CheckCircle, Network } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CareCoordination = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-[#3681DE]" />,
      title: 'Team Communication',
      description: 'Secure messaging and collaboration tools for healthcare teams and specialists'
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#3681DE]" />,
      title: 'Appointment Management',
      description: 'Streamlined scheduling and appointment coordination across care providers'
    },
    {
      icon: <Network className="h-6 w-6 text-[#3681DE]" />,
      title: 'Referral Management',
      description: 'Seamless referrals to specialists with complete care continuity'
    },
    {
      icon: <Users className="h-6 w-6 text-[#3681DE]" />,
      title: 'Patient Engagement',
      description: 'Tools to keep patients informed and engaged in their care journey'
    }
  ];

  const benefits = [
    'Reduce care coordination time by 50%',
    'Improve communication between providers',
    'Enhance patient satisfaction scores',
    'Streamline referral processes',
    'Ensure care plan adherence',
    'Minimize care gaps and delays'
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slideInLeft" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Care Coordination Platform</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-zoomIn" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
            Unite your healthcare team with powerful collaboration tools that ensure seamless
            care coordination and improved patient outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slideInLeft">
            <img
              src="https://images.unsplash.com/photo-1758691463331-2ac00e6f676f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare team coordination and collaborative care"
              className="w-full h-80 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
            />
          </div>

          <div className="animate-zoomIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Unified Care Management</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
              Break down silos between healthcare providers with our comprehensive care coordination
              platform that connects teams, streamlines workflows, and puts patients at the center of care.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <MessageSquare className="h-6 w-6 text-[#3681DE] mr-3 hover:rotate-12 transition-transform duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Secure Communication</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>HIPAA-compliant messaging and file sharing</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <Calendar className="h-6 w-6 text-[#3681DE] mr-3 hover:rotate-12 transition-transform duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Smart Scheduling</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Automated appointment coordination</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <Network className="h-6 w-6 text-[#3681DE] mr-3 hover:rotate-12 transition-transform duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Care Networks</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Connect with specialists and care teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:cursor-pointer hover:scale-110 hover:bg-[rgba(56,129,239,0.8)] transition-all duration-200 animate-zoomIn"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="mb-4 hover:scale-125 transition-transform duration-200">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-16 animate-flash">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-[#3681DE] mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Care Coordination Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
              Experience improved efficiency, better outcomes, and enhanced satisfaction across your care network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 animate-jiggle"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-[#3681DE] mr-3 animate-bounce" style={{ animationDelay: `${index * 150}ms` }} />
                <span className="text-gray-700" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center animate-wiggle">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Transform Your Care Coordination</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
            See how our care coordination platform can streamline your workflows and improve patient outcomes.
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

export default CareCoordination;