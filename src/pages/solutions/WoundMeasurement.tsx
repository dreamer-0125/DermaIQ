import { ArrowRight, Brain, Camera, Ruler, BarChart3, CheckCircle, Zap } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../../components/auth/AuthModal';

const WoundMeasurement = () => {
  const { isAuthModalOpen, authMode, handleScheduleDemo, closeAuthModal } = useScheduleDemo();
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

  const benefits = [
    'Eliminate manual measurement errors',
    'Reduce documentation time by 60%',
    'Improve clinical decision making',
    'Enhance patient engagement',
    'Streamline billing processes',
    'Support quality improvement initiatives'
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fadeIn">

          <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slideInLeft" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>AI Wound Measurement</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-zoomIn" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
            Transform wound assessment with clinical-grade AI that delivers precise measurements
            and comprehensive documentation in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="animate-slideInLeft">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
              alt="AI-powered medical measurement and diagnostic technology"
              className="w-full h-80 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
            />
          </div>
          <div className="animate-zoomIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 p-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <div className="bg-blue-100 rounded-lg p-2 hover:scale-110 transition-all duration-200">
                  <Camera className="h-6 w-6 text-[#3681DE]" />
                </div>
                <div className="">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>1. Capture</h3>
                  <p className="text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Take a photo of the wound with a ruler or calibration sticker visible for scale reference.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="bg-teal-100 rounded-lg p-2 hover:scale-110 transition-all duration-200">
                  <Brain className="h-6 w-6 text-[#3681DE]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>2. Analyze</h3>
                  <p className="text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>AI algorithms automatically detect wound boundaries and calculate precise measurements.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-2 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <div className="bg-green-100 rounded-lg p-2 hover:scale-110 transition-all duration-200">
                  <BarChart3 className="h-6 w-6 text-[#3681DE]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>3. Document</h3>
                  <p className="text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Generate comprehensive reports with measurements, images, and clinical recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:bg-[#3681DE] hover:bg-opacity-30 p-2 rounded-xl hover:cursor-pointer hover:scale-110 transition-all duration-200 animate-zoomIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 hover:rotate-12 transition-transform duration-200">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 mb-16 animate-flash">
          <div className="text-center mb-8">
            <Zap className="h-12 w-12 text-[#3681DE] mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Clinical Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
              Experience measurable improvements in wound care quality, efficiency, and patient outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-white rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 animate-jiggle"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-[#3681DE] mr-3 animate-bounce" style={{ animationDelay: `${index * 200}ms` }} />
                <span className="text-gray-700" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center flex flex-col items-center animate-glow py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}>
            See how AI wound measurement can transform your wound care practice with a personalized demonstration.
          </p>
          <button 
            onClick={handleScheduleDemo}
            className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105" 
            style={{ fontFamily: '"ITC Avant Garde Gothic Std", sans-serif' }}
          >
            Schedule Demo
            <ArrowRight className="h-4 w-4 ml-2" />
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

export default WoundMeasurement;