import { ArrowLeft, Brain, Camera, Ruler, BarChart3, CheckCircle, Zap, Target } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef } from 'react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const AIWoundMeasurement = () => {
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
      icon: <Camera className="h-6 w-6 text-[#3681DE]" />,
      title: 'Simple Photo Capture',
      description: 'Take wound photos with any smartphone or tablet using standard rulers for scale'
    },
    {
      icon: <Brain className="h-6 w-6 text-[#3681DE]" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced computer vision automatically segments wounds and calculates precise measurements'
    },
    {
      icon: <Ruler className="h-6 w-6 text-[#3681DE]" />,
      title: 'Accurate Measurements',
      description: '95% accuracy in wound area, length, width, and depth calculations'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-[#3681DE]" />,
      title: 'Progress Tracking',
      description: 'Visual healing progression with automated documentation and reporting'
    }
  ];

  const woundTypes = [
    'Diabetic foot ulcers',
    'Pressure injuries',
    'Venous leg ulcers',
    'Surgical wounds',
    'Traumatic wounds',
    'Burns and skin grafts'
  ];

  const benefits = [
    'Eliminate manual measurement errors',
    'Reduce documentation time by 60%',
    'Improve clinical decision making',
    'Enhance patient engagement',
    'Streamline billing processes',
    'Support quality improvement initiatives'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>AI Wound Measurement</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Transform wound assessment with clinical-grade AI that delivers precise measurements
            for preventive, chronic, and acute wound care across all patient populations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-zoomIn" ref={addToRefs}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80"
              alt="AI-powered medical measurement and wound assessment technology"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Comprehensive Wound Assessment</h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Our AI-powered wound measurement technology provides accurate, consistent assessments
              for all wound types - from preventive care to complex chronic wounds and acute injuries.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="bg-[#3681DE]/10 rounded-lg p-2">
                  <Camera className="h-6 w-6 text-[#3681DE]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>1. Capture</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Take a photo of the wound with a ruler or calibration sticker visible for scale reference.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="bg-[#3681DE]/10 rounded-lg p-2">
                  <Brain className="h-6 w-6 text-[#3681DE]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>2. Analyze</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>AI algorithms automatically detect wound boundaries and calculate precise measurements.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="bg-[#3681DE]/10 rounded-lg p-2">
                  <BarChart3 className="h-6 w-6 text-[#3681DE]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>3. Document</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Generate comprehensive reports with measurements, images, and clinical recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Supported Wound Types</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {woundTypes.map((type, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Target className="h-5 w-5 text-[#3681DE] mr-3" />
                  <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 animate-slideInLeft" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#3681DE]/5 rounded-2xl p-8 mb-16 animate-zoomIn" ref={addToRefs}>
          <div className="text-center mb-8">
            <Zap className="h-12 w-12 text-[#3681DE] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Clinical Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Experience measurable improvements in wound care quality, efficiency, and patient outcomes
              across preventive, chronic, and acute care settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CheckCircle className="h-5 w-5 text-[#3681DE] mr-3" />
                <span className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center animate-slideInLeft" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            See how AI wound measurement can transform your wound care practice with a personalized demonstration.
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

export default AIWoundMeasurement;