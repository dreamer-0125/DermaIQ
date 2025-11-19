import { ArrowLeft, Heart, TrendingUp, Clock, Users, CheckCircle, Target, Shield } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef } from 'react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const ChronicWoundManagement = () => {
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
      icon: <Heart className="h-6 w-6 text-[#3681DE]" />,
      title: 'Diabetic Ulcer Care',
      description: 'Specialized protocols for diabetic foot ulcers with glucose management integration'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3681DE]" />,
      title: 'Pressure Injury Prevention',
      description: 'Advanced pressure mapping and prevention strategies for at-risk patients'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#3681DE]" />,
      title: 'Venous Wound Treatment',
      description: 'Comprehensive venous leg ulcer management with compression therapy guidance'
    },
    {
      icon: <Clock className="h-6 w-6 text-[#3681DE]" />,
      title: 'Long-term Monitoring',
      description: 'Continuous tracking and adjustment of treatment plans for optimal healing'
    }
  ];

  const chronicConditions = [
    'Diabetic foot ulcers',
    'Pressure injuries (Stage I-IV)',
    'Venous leg ulcers',
    'Arterial ulcers',
    'Mixed etiology wounds',
    'Non-healing surgical wounds'
  ];

  const managementApproach = [
    {
      title: 'Comprehensive wound assessment',
      description: 'Thorough evaluation of wound characteristics, size, depth, and healing indicators'
    },
    {
      title: 'Underlying condition management',
      description: 'Addressing root causes such as diabetes, vascular issues, and nutritional deficiencies'
    },
    {
      title: 'Advanced dressing selection',
      description: 'Evidence-based wound dressing protocols tailored to wound type and healing stage'
    },
    {
      title: 'Compression therapy protocols',
      description: 'Customized compression strategies for venous ulcers and edema management'
    },
    {
      title: 'Offloading strategies',
      description: 'Pressure redistribution techniques to prevent further tissue damage'
    },
    {
      title: 'Patient education and compliance',
      description: 'Ongoing patient training and support to ensure treatment adherence'
    }
  ];

  const benefits = [
    'Reduce healing time by 35%',
    'Prevent wound recurrence',
    'Improve quality of life',
    'Reduce amputation risk',
    'Lower long-term costs',
    'Enhanced patient compliance'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Chronic Wound Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Comprehensive care for diabetic ulcers, pressure injuries, and venous wounds with
            specialized protocols designed for long-term healing success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-zoomIn" ref={addToRefs}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
              alt="Chronic wound care and long-term patient management"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Specialized Chronic Care</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Chronic wounds require specialized expertise and long-term management strategies.
              Our comprehensive approach addresses underlying conditions while optimizing healing environments.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Heart className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Diabetic Expertise</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Specialized diabetic foot ulcer protocols</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Shield className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Pressure Prevention</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Advanced pressure injury management</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#3681DE]/10 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <TrendingUp className="h-6 w-6 text-[#3681DE] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Venous Care</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Comprehensive venous ulcer treatment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Chronic Conditions We Treat</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chronicConditions.map((condition, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Target className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-slideInLeft" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Management Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementApproach.map((approach, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <div className="bg-[#3681DE]/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#3681DE] font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{approach.title}</h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{approach.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Specialized Features</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Treatment Outcomes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Proven results in chronic wound healing and patient quality of life improvement.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Transform Chronic Wound Care</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            See how our specialized chronic wound management can improve healing outcomes for your most challenging cases.
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

export default ChronicWoundManagement;