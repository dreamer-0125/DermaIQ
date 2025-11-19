import { Users, BookOpen, Target, TrendingUp, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ClinicalDecisionSupport = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-teal-600" />,
      title: 'Evidence-Based Protocols',
      description: 'Access to the latest clinical guidelines and best practices for wound care management'
    },
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: 'Risk Assessment',
      description: 'Automated risk stratification for infection, delayed healing, and complications'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: 'Treatment Recommendations',
      description: 'Personalized treatment plans based on wound type, patient history, and clinical data'
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: 'Quality Assurance',
      description: 'Built-in quality checks and alerts to ensure adherence to clinical standards'
    }
  ];

  const capabilities = [
    'Wound classification and staging',
    'Treatment protocol recommendations',
    'Medication and dressing guidance',
    'Infection risk assessment',
    'Healing timeline predictions',
    'Complication alerts and warnings'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* <div className="mb-8">
          <Link to="/solutions" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-all duration-200 hover:translate-x-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>
        </div> */}

        <div className="text-center mb-16 animate-fade-in">
          {/* <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Clinical Excellence
          </div> */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slide-up">Clinical Decision Support</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up-delay">
            Empower healthcare professionals with evidence-based recommendations and intelligent
            clinical guidance for optimal wound care outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Intelligent Clinical Guidance</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our clinical decision support system combines the latest evidence-based medicine with
              AI-powered insights to provide personalized treatment recommendations for every wound type and patient scenario.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-teal-50 rounded-lg hover:cursor-pointer hover:scale-105 hover:bg-[#3681DE] transition-all duration-200 group transform-gpu">
                <BookOpen className="h-6 w-6 text-teal-600 mr-3 group-hover:text-white transition-colors duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">Evidence-Based Medicine</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-200">Latest clinical guidelines and research</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:cursor-pointer hover:scale-105 hover:bg-[#3681DE] transition-all duration-200 group transform-gpu">
                <Target className="h-6 w-6 text-blue-600 mr-3 group-hover:text-white transition-colors duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">Personalized Recommendations</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-200">Tailored to patient and wound characteristics</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 rounded-lg hover:cursor-pointer hover:scale-105 hover:bg-[#3681DE] transition-all duration-200 group transform-gpu">
                <Shield className="h-6 w-6 text-green-600 mr-3 group-hover:text-white transition-colors duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">Quality Assurance</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-200">Built-in safety checks and alerts</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slide-right">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Clinical decision support systems and healthcare AI"
              className="w-full h-80 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 animate-float"
            />
          </div>
        </div>

        <div className="mb-16 animate-fade-in-delay">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:cursor-pointer hover:scale-105 hover:bg-[rgba(56,129,239,0.8)] transition-all duration-200 group transform-gpu hover:text-white"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-4 text-white">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-200">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 mb-16 animate-fade-in-delay-2">
          <div className="text-center mb-8">
            <Users className="h-12 w-12 text-teal-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Clinical Decision Support Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to support clinical decision-making at every stage of wound care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:cursor-pointer hover:scale-105 hover:bg-[#3681DE] transition-all duration-200 group transform-gpu"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 group-hover:text-white transition-colors duration-200" />
                <span className="text-gray-700 group-hover:text-white transition-colors duration-200">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center animate-fade-in-delay-3">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Enhance Your Clinical Practice</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover how our clinical decision support system can improve care quality and patient outcomes in your practice.
          </p>
          <button className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto">
            Request Demo
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slideUp 1s ease-out 0.2s both;
        }
        
        .animate-slide-left {
          animation: slideLeft 1s ease-out;
        }
        
        .animate-slide-right {
          animation: slideRight 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fadeIn 1s ease-out 0.8s both;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ClinicalDecisionSupport;