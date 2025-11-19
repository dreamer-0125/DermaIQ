import { BadgeCheck, PersonStanding, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { useScheduleDemo } from '../../hooks/useScheduleDemo';
import { AuthModal } from '../auth/AuthModal';

const Hero = () => {
  const { isAuthModalOpen, authMode, handleScheduleDemo, closeAuthModal } = useScheduleDemo();
  return (
    <section id="hero" className="bg-[#F6F6F6] py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-4 sm:mb-6 leading-loose lg:leading-normal">
              Co-Design Your Wound Care Future with
              <span className="text-[#3681DE] "> DermaIQ</span>
            </h1>
            <p className="text-[#304460] sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Better Strategy. Smarter AI. Real Collaboration. Design the wound care model that fits your organization with AI-powered measurement, clinical guidance, and seamless care coordination.
            </p>
            <div className="inline-flex items-center py-2 text-[#1D4ED8] font-bold rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Trusted by 500+ Healthcare Organizations</span>
              <span className="sm:hidden">500+ Healthcare Organizations</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={handleScheduleDemo}
                className="flex flex-row items-center justify-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 w-fit"
              >
                Schedule Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
            <div className="bg-white p-4 sm:p-6 mb-6 sm:mb-8 rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center text-gray-700">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black mr-2 sm:mr-3 flex-shrink-0" />
                  <span>AI-powered wound measurement</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <PersonStanding className="w-4 h-4 sm:w-5 sm:h-5 text-black mr-2 sm:mr-3 flex-shrink-0" />
                  <span>Clinical decision support</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-black mr-2 sm:mr-3 flex-shrink-0" />
                  <span>Automated documentation</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-black mr-2 sm:mr-3 flex-shrink-0" />
                  <span>HIPAA-compliant platform</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 w-full">
            {/* Bottom-right image behind - hidden on mobile */}
            <div className="hidden lg:block">
              <img
                src="/hero/hero-right-bottom.png"
                alt="HealthCare"
                className="absolute right-0 -bottom-20 h-2/3 w-auto rounded-2xl opacity-20 z-0 animate-zoomInOut"
              />
            </div>
            {/* Top-left image - hidden on mobile */}
            <div className="hidden lg:block">
              <img
                src="/hero/hero-center-top.png"
                alt="HealthCare"
                className="absolute -left-32 -top-32 h-2/3 w-auto rounded-3xl z-100 opacity-25 animate-zoomInOut-delayed"
              />
            </div>
            {/* Main Hero Image - full size on mobile, positioned on desktop */}
            <div className="relative z-20">
              <img
                src="/hero/hero-main.png"
                alt="HealthCare"
                className="w-full h-auto lg:h-4/5 lg:w-4/5 rounded-2xl animate-zoomInOut-main"
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </section>
  );
};

export default Hero;