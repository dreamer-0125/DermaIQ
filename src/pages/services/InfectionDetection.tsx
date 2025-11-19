import { ArrowLeft, AlertTriangle, Eye, Shield, CheckCircle, Camera, Brain } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef } from 'react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const InfectionDetection = () => {
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
      icon: <Eye className="h-6 w-6 text-[#3681DE]" />,
      title: 'Advanced Imaging',
      description: 'Multi-spectral imaging and fluorescence detection for early infection identification'
    },
    {
      icon: <Brain className="h-6 w-6 text-[#3681DE]" />,
      title: 'AI Risk Assessment',
      description: 'Machine learning algorithms analyze visual and clinical indicators for infection risk'
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-[#3681DE]" />,
      title: 'Early Warning System',
      description: 'Proactive alerts for infection signs before clinical symptoms become apparent'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3681DE]" />,
      title: 'Treatment Protocols',
      description: 'Evidence-based infection management protocols and antibiotic stewardship guidance'
    }
  ];

  const detectionMethods = [
    'Visual assessment and documentation',
    'Thermal imaging analysis',
    'Fluorescence imaging (future)',
    'Bacterial load estimation',
    'Biomarker identification',
    'Clinical indicator correlation'
  ];

  const benefits = [
    'Reduce infection rates by 40%',
    'Earlier intervention and treatment',
    'Prevent wound complications',
    'Optimize antibiotic usage',
    'Improve healing outcomes',
    'Lower healthcare costs'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Infection Detection & Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Prevent wound complications with advanced imaging and AI-powered infection detection
            that identifies risks before they become critical clinical issues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-zoomIn" ref={addToRefs}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Early Detection Saves Lives</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Our advanced infection detection system combines cutting-edge imaging technology with
              AI-powered risk assessment to identify infection signs days before traditional clinical methods.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Eye className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Multi-Spectral Imaging</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Advanced imaging beyond visible spectrum</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Brain className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>AI Risk Analysis</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Predictive modeling for infection risk</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <AlertTriangle className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Proactive Alerts</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Early warning system for intervention</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
              alt="Advanced medical imaging and infection detection technology"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Detection Methods</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detectionMethods.map((method, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Camera className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-slideInLeft" ref={addToRefs}>
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

        <div className="bg-[#3681DE]/5 rounded-2xl p-8 mb-16 animate-zoomIn" ref={addToRefs}>
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-[#3681DE] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Clinical Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Proven results in infection prevention and management across healthcare settings.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Prevent Infections Before They Start</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Learn how our infection detection technology can improve patient outcomes and reduce complications in your practice.
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

export default InfectionDetection;