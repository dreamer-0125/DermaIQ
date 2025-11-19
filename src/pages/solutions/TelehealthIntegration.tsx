import { Video, Smartphone, Monitor, CheckCircle, Globe, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TelehealthIntegration = () => {
  const features = [
    {
      icon: <Video className="h-6 w-6 text-purple-600" />,
      title: 'Virtual Consultations',
      description: 'High-quality video consultations with wound care specialists and healthcare teams'
    },
    {
      icon: <Smartphone className="h-6 w-6 text-blue-600" />,
      title: 'Mobile Access',
      description: 'Full-featured mobile app for patients and providers to access care anywhere'
    },
    {
      icon: <Monitor className="h-6 w-6 text-green-600" />,
      title: 'Remote Monitoring',
      description: 'Continuous wound monitoring with AI-powered progress tracking and alerts'
    },
    {
      icon: <Globe className="h-6 w-6 text-teal-600" />,
      title: 'Platform Integration',
      description: 'Seamless integration with existing EMR systems and telehealth platforms'
    }
  ];

  const capabilities = [
    'HD video consultations with specialists',
    'Remote wound assessment and monitoring',
    'Patient education and self-care guidance',
    'Real-time collaboration tools',
    'Secure file sharing and messaging',
    'Automated appointment scheduling'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slide-up">Telehealth Integration</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up-delay">
            Extend your wound care capabilities with comprehensive telehealth integration
            that brings expert care directly to patients wherever they are.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Care Without Boundaries</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our telehealth integration breaks down geographical barriers, enabling expert wound care
              consultation and monitoring regardless of location. Provide continuous care with the same
              quality and precision as in-person visits.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 group transform">
                <Video className="h-6 w-6 text-purple-600 mr-3 group-hover:text-white transition-colors duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">Virtual Consultations</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-200">Connect with specialists instantly</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 group transform">
                <Smartphone className="h-6 w-6 text-blue-600 mr-3 group-hover:text-white transition-colors duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">Mobile-First Design</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-200">Access care from any device</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 rounded-lg hover:cursor-pointer hover:scale-110 hover:bg-[#3681DE] transition-all duration-200 group transform">
                <Monitor className="h-6 w-6 text-green-600 mr-3 group-hover:text-white transition-colors duration-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">Continuous Monitoring</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-200">24/7 wound progress tracking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slide-right">
            <img
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
              alt="Telehealth technology and remote medical consultation"
              className="w-full h-80 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-float"
            />
          </div>
        </div>

        <div className="mb-16 animate-fade-in-delay">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Telehealth Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:cursor-pointer hover:bg-[#3681DE] transition-all duration-200 group animate-card-in transform hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 group-hover:text-white transition-colors duration-200">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-200">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-16 animate-fade-in-delay-2">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Telehealth Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive remote care tools that maintain the highest standards of clinical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:cursor-pointer hover:bg-[#3681DE] transition-all duration-200 group animate-list-item transform hover:scale-110"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 group-hover:text-white transition-colors duration-200" />
                <span className="text-gray-700 group-hover:text-white transition-colors duration-200">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center animate-fade-in-delay-3">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Expand Your Reach</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover how telehealth integration can extend your wound care services and improve patient access to expert care.
          </p>
          <button className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-8 py-4 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto">
            Schedule Consultation
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { opacity: 1; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes list-item {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.8s both;
        }
        
        .animate-card-in {
          animation: card-in 0.6s ease-out both;
        }
        
        .animate-list-item {
          animation: list-item 0.6s ease-out both;
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

export default TelehealthIntegration;