import { Camera, Bot, FileText, Heart, Shield, Glasses } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Modern = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-12 sm:py-16 lg:py-24 relative">
      <div className="hidden lg:block">
        <img
          src="/modern/modern.png"
          alt="HealthCare"
          className={`absolute -left-10 -top-10 h-2/3 w-auto rounded-3xl z-100 opacity-10 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-10' : '-translate-x-20 opacity-0'}`}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partnership Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          <div className={`relative transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-4 sm:mb-6 leading-loose lg:leading-normal">
              Modern Wound Care Powered by AI, <br />
              <span className="text-[#3681DE] "> Designed for Results</span>
            </h1>
            <p className="text-[#304460] sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Our co-designed platform combines cutting-edge AI technology with clinical expertise to deliver
              measurable improvements in wound care outcomes, efficiency, and patient satisfaction.            </p>
          </div>
          <div className={`flex flex-col gap-2 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
            <div className="flex flex-row items-center gap-4 mb-8">
              <div>
                <Camera className="h-10 w-10 text-[#3681DE] mr-3" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Simple Image-Based Measurement
                </h3>
                <span className="text-gray-700">
                  Upload wound photos with a standard ruler. Our AI accurately segments wounds and calculates dimensions without specialized hardware.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 mb-8">
              <div>
                <Bot className="h-10 w-10 text-[#3681DE] mr-3" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  AI-Driven Clinical Guidance
                </h3>
                <span className="text-gray-700">
                  Receive personalized treatment recommendations based on wound classification and evidence-based protocols.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 mb-8">
              <div>
                <FileText className="h-10 w-10 text-[#3681DE] mr-3" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Billing & Documentation Support
                </h3>
                <span className="text-gray-700">
                  Automatically suggest CPT codes and generate compliant clinical notes to streamline billing and reduce claim denials.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 mb-8">
              <div>
                <Heart className="h-10 w-10 text-[#3681DE] mr-3" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Telehealth & Care Coordination
                </h3>
                <span className="text-gray-700">
                  Manage referrals, schedule follow-ups, and collaborate securely with care teams through integrated tools.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 mb-8">
              <div>
                <Glasses className="h-10 w-10 text-[#3681DE] mr-3" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Future-Ready Infection Detection
                </h3>
                <span className="text-gray-700">
                  Designed to evolve with features like fluorescence imaging for infection detection and advanced diagnostics.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 mb-8">
              <div>
                <Shield className="h-10 w-10 text-[#3681DE] mr-3" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Enterprise-Grade Security
                </h3>
                <span className="text-gray-700">
                  Built with HIPAA-compliant security to protect patient data and ensure regulatory compliance.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Modern;
