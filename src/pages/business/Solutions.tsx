import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Users, Shield, Zap, CheckCircle, Heart, Wifi } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Solutions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [animateBenefits, setAnimateBenefits] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const solutions = [
    {
      id: 'wound-measurement',
      title: 'AI Wound Measurement',
      description: 'Advanced computer vision technology for precise wound assessment and tracking with 95% accuracy',
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      features: ['95% measurement accuracy', 'Instant analysis', 'Progress tracking', 'Clinical documentation'],
      color: '#3681DE'
    },
    {
      id: 'clinical-decision-support',
      title: 'Clinical Decision Support',
      description: 'Evidence-based treatment recommendations and care protocols for improved outcomes',
      icon: <Users className="h-8 w-8 text-teal-600" />,
      features: ['Treatment protocols', 'Risk assessment', 'Care pathways', 'Quality metrics'],
      color: '#3681DE'
    },
    {
      id: 'care-coordination',
      title: 'Care Coordination Platform',
      description: 'Seamless collaboration between healthcare teams and specialists for polychronic patients',
      icon: <Shield className="h-8 w-8 text-green-600" />,
      features: ['Team communication', 'Referral management', 'Patient engagement', 'Workflow automation'],
      color: '#3681DE'
    },
    {
      id: 'telehealth-integration',
      title: 'Telehealth Integration',
      description: 'Remote wound assessment and virtual care capabilities for hybrid care delivery',
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      features: ['Virtual consultations', 'Remote monitoring', 'Patient education', 'Mobile access'],
      color: '#3681DE'
    }
  ];

  const hybridCareBenefits = [
    {
      icon: <Heart className="h-6 w-6 text-[#3681DE]" />,
      title: 'Improved Patient Outcomes',
      description: 'Personalized care plans lead to better health and quality of life'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3681DE]" />,
      title: 'Reduced Healthcare Costs',
      description: 'Proactive care minimizes avoidable hospital visits'
    },
    {
      icon: <Wifi className="h-6 w-6 text-[#3681DE]" />,
      title: 'Enhanced Access',
      description: 'Telehealth and remote monitoring ensure continuous support'
    },
    {
      icon: <Users className="h-6 w-6 text-[#3681DE]" />,
      title: 'Coordinated Care',
      description: 'Dedicated care team manages patient needs across settings'
    }
  ];

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === benefitsRef.current) {
              setAnimateBenefits(true);
            } else if (entry.target === cardsRef.current) {
              setAnimateCards(true);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (benefitsRef.current) observer.observe(benefitsRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section with Entrance Animation */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ease-out transform ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }`}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            <span className="text-[#3681DE] animate-pulse"> DermaIQ &nbsp;</span>
            Solutions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered wound care solutions designed to transform
            healthcare delivery and improve patient outcomes through our innovative hybrid care model.
          </p>
        </div>

        {/* Hybrid Care Model Section with Staggered Animation */}
        <div
          ref={benefitsRef}
          className="bg-blue-50 rounded-2xl p-8 mb-16 transition-all duration-1000 ease-out transform"
        >
          <div className={`text-center mb-8 transition-all duration-700 delay-300 transform ${animateBenefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transforming Care for Polychronic Patients</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our innovative hybrid care model addresses the challenges of fragmented care, frequent ER visits,
              and poor health outcomes for patients with multiple chronic conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hybridCareBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-xl hover:rotate-1 hover:cursor-pointer ${animateBenefits
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                  }`}
                style={{
                  transitionDelay: `${400 + index * 100}ms`,
                  transform: animateBenefits ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(2deg)'
                }}
              >
                <div className="mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions Cards with Staggered Animation */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {solutions.map((solution, index) => (
            <div
              key={solution.id}
              className={`bg-gray rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-2xl hover:rotate-1 hover:border-blue-300 ${animateCards
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
                }`}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
                transform: animateCards ? 'translateY(0) rotate(0deg)' : 'translateY(30px) rotate(1deg)'
              }}
            >
              <div className="mb-6 group">
                <img
                  src={`https://images.unsplash.com/photo-${solution.id === 'wound-measurement' ? '1530497610245-94d3c16cda28' :
                    solution.id === 'clinical-decision-support' ? '1504813184591-01572f98c85f' :
                      solution.id === 'care-coordination' ? '1576091160550-2173dba999ef' :
                        '1571019613454-1cb2f99b2d8b'
                    }?auto=format&fit=crop&w=600&q=80`}
                  alt={`${solution.title} healthcare technology`}
                  className="w-full h-48 object-cover rounded-xl shadow-md transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl"
                />
              </div>
              <div className="mb-6">
                <div className={`inline-flex p-3 rounded-lg bg-${solution.color}-50 mb-4 transition-all duration-300 hover:scale-110 hover:rotate-3`}>
                  {/* {solution.icon} */}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#3681DE]">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-700 transition-all duration-300 hover:text-[#3681DE] hover:translate-x-2"
                      style={{
                        transitionDelay: `${featureIndex * 50}ms`
                      }}
                    >
                      <CheckCircle className="h-4 w-4 text-[#3681DE] mr-2 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/solutions/${solution.id}`}
                className={`inline-flex items-center px-6 py-3 bg-[#3681DE] text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#2B6BC7] hover:rotate-1 transform hover:-translate-y-1`}
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Call to Action with Fade In Animation */}
        <div className={`text-center transition-all duration-1000 delay-500 transform ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Solutions;