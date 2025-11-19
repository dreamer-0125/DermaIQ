import { ArrowLeft, Scissors, Shield, AlertTriangle, TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef } from 'react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const SurgicalWoundCare = () => {
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
      icon: <Scissors className="h-6 w-6 text-[#3681DE]" />,
      title: 'Post-Surgical Monitoring',
      description: 'Comprehensive tracking of surgical site healing with AI-powered progress assessment'
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-[#3681DE]" />,
      title: 'Complication Detection',
      description: 'Early identification of surgical site infections, dehiscence, and other complications'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3681DE]" />,
      title: 'Infection Prevention',
      description: 'Evidence-based protocols for preventing surgical site infections (SSI)'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#3681DE]" />,
      title: 'Healing Optimization',
      description: 'Personalized care plans to optimize surgical wound healing outcomes'
    }
  ];

  const surgicalTypes = [
    'Orthopedic surgical sites',
    'Cardiac surgery incisions',
    'Abdominal surgical wounds',
    'Plastic surgery sites',
    'Trauma surgery repairs',
    'Minimally invasive procedures'
  ];

  const complications = [
    'Surgical site infections (SSI)',
    'Wound dehiscence',
    'Seroma formation',
    'Hematoma development',
    'Delayed healing',
    'Scar tissue formation'
  ];

  const benefits = [
    'Reduce SSI rates by 45%',
    'Earlier complication detection',
    'Faster healing times',
    'Improved patient satisfaction',
    'Lower readmission rates',
    'Reduced healthcare costs'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Post-Surgical Wound Care</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Optimize surgical site healing and prevent complications with comprehensive
            post-operative wound monitoring and management protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-zoomIn" ref={addToRefs}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Surgical Site Excellence</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Post-surgical wound care requires specialized attention to prevent complications and
              ensure optimal healing. Our comprehensive monitoring system tracks healing progress
              and identifies potential issues before they become serious complications.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Scissors className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Surgical Site Monitoring</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Continuous healing assessment</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <AlertTriangle className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Early Detection</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Identify complications before symptoms</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Shield className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Prevention Protocols</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Evidence-based infection prevention</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
              alt="Advanced surgical monitoring and post-operative care technology"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Surgical Specialties</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surgicalTypes.map((type, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Target className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-slideInLeft" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Complications We Monitor</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complications.map((complication, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <AlertTriangle className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{complication}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Core Features</h2>
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
            <Clock className="h-12 w-12 text-[#3681DE] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Clinical Outcomes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Proven improvements in surgical site healing and complication prevention.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Optimize Surgical Outcomes</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Learn how our post-surgical wound care protocols can improve healing outcomes and reduce complications.
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

export default SurgicalWoundCare;