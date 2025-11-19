import { ArrowRight, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { getRandomAnimations, getRandomCardHovers } from '../../utils/animationUtils';

const Contact = () => {
  // Get random animations for this component
  const contactAnimations = getRandomAnimations(4);
  const cardHovers = getRandomCardHovers(6);

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#3681DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <div className={`mb-6 ${contactAnimations[0]}`}>
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" 
                alt="Healthcare innovation and AI-powered medical technology"
                className="w-full h-32 sm:h-40 object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className={`inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white border-opacity-30 ${contactAnimations[1]}`}>
              Ready to Transform Your Wound Care?
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight ${contactAnimations[2]}`}>
              Let's Co-Design Your Perfect Wound Care Solution
            </h2>
            <p className={`text-base sm:text-lg text-white text-opacity-90 mb-6 sm:mb-8 leading-relaxed ${contactAnimations[3]}`}>
              Schedule a consultation with our clinical and technical experts. We'll analyze your current workflows and design a custom solution that delivers measurable results.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 ${contactAnimations[3]}`}>
              <button className="bg-white text-[#3681DE] px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <span className="hidden sm:inline">Schedule Co-Design Session</span>
                <span className="sm:hidden">Book a Demo</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-[#3681DE] transition-all duration-200">
                <span className="hidden sm:inline">Request Information</span>
                <span className="sm:hidden">Learn More</span>
              </button>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs sm:text-sm text-white text-opacity-90 ${contactAnimations[3]}`}>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0" />
                <span>Free consultation included</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0" />
                <span>Custom implementation plan</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0" />
                <span>Dedicated success team</span>
              </div>
            </div>
          </div>
          
          <div className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white border-opacity-20 ${contactAnimations[2]}`}>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Contact Our Team</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className={`flex items-center p-3 sm:p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 ${cardHovers[0]}`}>
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Email Us</h4>
                  <p className="text-white text-opacity-80 text-xs sm:text-sm">contact@dermaiq.org</p>
                  <p className="text-white text-opacity-80 text-xs sm:text-sm">support@dermaiq.org</p>
                </div>
              </div>
              
              <div className={`flex items-center p-3 sm:p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 ${cardHovers[1]}`}>
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Call Us</h4>
                  <p className="text-white text-opacity-80 text-xs sm:text-sm">+1 (404) 236-9566</p>
                </div>
              </div>
              
              <div className={`flex items-center p-3 sm:p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 ${cardHovers[2]}`}>
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Visit Us</h4>
                  <p className="text-white text-opacity-80 text-xs sm:text-sm">1345 Wiley Rd, Suite 111</p>
                  <p className="text-white text-opacity-80 text-xs sm:text-sm">Schaumburg, IL 60169</p>
                </div>
              </div>
            </div>
            
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10 ${cardHovers[3]}`}>
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">What to Expect:</h4>
              <ul className="text-xs sm:text-sm text-white text-opacity-80 space-y-1">
                <li>• 30-minute discovery call</li>
                <li>• Custom solution design</li>
                <li>• Implementation timeline</li>
                <li>• ROI projections</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={`mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white border-opacity-20 text-center ${contactAnimations[0]}`}>
          <p className="text-white text-opacity-90 mb-4 sm:mb-6 text-sm sm:text-base">Trusted by healthcare organizations nationwide</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-60">
            <div className={`bg-white bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white border-opacity-20 ${cardHovers[4]}`}>
              <span className="text-white font-semibold text-xs sm:text-sm">500+ Providers</span>
            </div>
            <div className={`bg-white bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white border-opacity-20 ${cardHovers[5]}`}>
              <span className="text-white font-semibold text-xs sm:text-sm">95% Accuracy</span>
            </div>
            <div className={`bg-white bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white border-opacity-20 ${cardHovers[0]}`}>
              <span className="text-white font-semibold text-xs sm:text-sm">HIPAA Compliant</span>
            </div>
            <div className={`bg-white bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white border-opacity-20 ${cardHovers[1]}`}>
              <span className="text-white font-semibold text-xs sm:text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;