import { ArrowLeft, Users, Calendar, MessageSquare, FileText, CheckCircle, Network, Shield } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef } from 'react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const CareCoordination = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<HTMLElement[]>([]);
  const { isAuthModalOpen, authMode, handleScheduleDemo, closeAuthModal } = useScheduleDemo();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsRef.current.forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  const features = [
    {
      icon: <Users className="h-6 w-6 text-[#3681DE]" />,
      title: 'Team Communication',
      description: 'Secure messaging and collaboration tools for healthcare teams and specialists'
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#3681DE]" />,
      title: 'Scheduling & Tracking',
      description: 'Automated appointment scheduling and wound care visit tracking'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#3681DE]" />,
      title: 'Patient Communication',
      description: 'Two-way communication platform for patient updates and care coordination'
    },
    {
      icon: <FileText className="h-6 w-6 text-[#3681DE]" />,
      title: 'Documentation Hub',
      description: 'Centralized documentation and care plan management system'
    }
  ];

  const coordinationServices = [
    'Multi-disciplinary team communication',
    'Appointment scheduling and reminders',
    'Care plan development and tracking',
    'Patient progress monitoring',
    'Family and caregiver updates',
    'Insurance and billing coordination'
  ];

  const teamMembers = [
    'Primary care physicians',
    'Wound care specialists',
    'Nurses and care coordinators',
    'Physical therapists',
    'Nutritionists and dietitians',
    'Social workers and case managers'
  ];

  const benefits = [
    'Reduce care coordination time by 50%',
    'Improve team communication',
    'Enhance patient satisfaction',
    'Streamline care transitions',
    'Reduce missed appointments',
    'Better care plan adherence'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Care Coordination</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Streamline wound care coordination with scheduling, tracking, and team communication
            tools that keep everyone connected and informed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-zoomIn" ref={addToRefs}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Unified Care Management</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Effective wound care requires seamless coordination between multiple healthcare providers,
              patients, and caregivers. Our platform centralizes communication, scheduling, and
              documentation to ensure everyone stays informed and aligned.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Users className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Team Collaboration</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Connect all care team members</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Calendar className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Smart Scheduling</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Automated appointment coordination</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <MessageSquare className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Patient Engagement</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Keep patients informed and involved</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1751969547647-61a76ca3a61f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare team coordination and collaborative care management"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Coordination Services</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coordinationServices.map((service, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Network className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-slideInLeft" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Care Team Members</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Users className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer animate-tada" ref={addToRefs}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#3681DE]/5 rounded-2xl p-8 mb-16 animate-fadeIn" ref={addToRefs}>
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-[#3681DE] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Coordination Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Streamlined care coordination leads to better outcomes and improved efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CheckCircle className="h-5 w-5 text-[#3681DE] mr-3" />
                <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center animate-slideInLeft" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Streamline Your Care Coordination</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            See how our care coordination platform can improve team communication and patient outcomes.
          </p>
          <button 
            onClick={handleScheduleDemo}
            className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl animate-glow" 
            ref={addToRefs}
          >
            Schedule Demo
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </button>
        </div>
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </div>
  );
};

export default CareCoordination;