import { ArrowLeft, FileText, Users, Star, Clock, CheckCircle, Network, Target } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef } from 'react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const ReferralManagement = () => {
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
      icon: <Star className="h-6 w-6 text-[#3681DE]" />,
      title: 'High-Quality Specialists',
      description: 'Curated network of top-rated wound care specialists and advanced treatment centers'
    },
    {
      icon: <Network className="h-6 w-6 text-[#3681DE]" />,
      title: 'In-Network Alignment',
      description: 'Seamless referrals to specialists within your insurance network for cost optimization'
    },
    {
      icon: <Clock className="h-6 w-6 text-[#3681DE]" />,
      title: 'White-Glove Service',
      description: 'Full-service referral coordination from initial contact to appointment completion'
    },
    {
      icon: <FileText className="h-6 w-6 text-[#3681DE]" />,
      title: 'Complete Documentation',
      description: 'Comprehensive referral documentation and care continuity management'
    }
  ];

  const specialistTypes = [
    'Wound care specialists',
    'Vascular surgeons',
    'Plastic surgeons',
    'Infectious disease specialists',
    'Endocrinologists',
    'Hyperbaric medicine physicians'
  ];


  const benefits = [
    'Reduce referral wait times by 60%',
    'Ensure in-network specialist access',
    'Improve care continuity',
    'Enhance patient satisfaction',
    'Streamline documentation',
    'Better clinical outcomes'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">


        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Specialist Referral Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            White-glove referrals to in-network, high-quality wound care specialists and
            advanced treatment centers with complete care coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-zoomIn" ref={addToRefs}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?q=80&w=2726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare specialist network and referral coordination technology"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Expert Specialist Network</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Access our curated network of high-quality wound care specialists with seamless
              referral coordination. We handle everything from specialist matching to appointment
              scheduling, ensuring patients receive the right care at the right time.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Star className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Quality Specialists</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Top-rated wound care experts</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Network className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Network Alignment</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>In-network specialist matching</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Clock className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Full-Service Coordination</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>End-to-end referral management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Specialist Network</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialistTypes.map((type, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Target className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Service Features</h2>
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
            <Users className="h-12 w-12 text-[#3681DE] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Referral Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Streamlined specialist referrals that improve access, reduce wait times, and enhance care quality.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Access Expert Specialists</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Learn how our white-glove referral management can connect your patients with the right specialists quickly and efficiently.
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

export default ReferralManagement;