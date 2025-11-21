import { useEffect, useRef } from 'react';
import { Users, Heart, Brain, Shield, Wifi, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AboutUs = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

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

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-[#3681DE]" />,
      title: 'Patient-Centered Care',
      description: 'Every decision we make is guided by what\'s best for patient outcomes and healing.'
    },
    {
      icon: <Brain className="h-8 w-8 text-[#3681DE]" />,
      title: 'Innovation Excellence',
      description: 'We push the boundaries of AI and healthcare technology to solve real clinical challenges.'
    },
    {
      icon: <Users className="h-8 w-8 text-[#3681DE]" />,
      title: 'Collaborative Partnership',
      description: 'We co-design solutions with healthcare professionals, not for them.'
    },
    {
      icon: <Shield className="h-8 w-8 text-[#3681DE]" />,
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data security and regulatory compliance.'
    }
  ];

  const hybridCareFeatures = [
    {
      icon: <Users className="h-6 w-6 text-[#3681DE]" />,
      title: 'Dedicated Care Team',
      description: 'A coordinated team manages patient needs across virtual and in-home settings'
    },
    {
      icon: <Wifi className="h-6 w-6 text-[#3681DE]" />,
      title: 'Enhanced Access',
      description: 'Telehealth and remote monitoring ensure continuous support'
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3681DE]" />,
      title: 'Reduced Costs',
      description: 'Proactive care minimizes avoidable hospital visits'
    },
    {
      icon: <Heart className="h-6 w-6 text-[#3681DE]" />,
      title: 'Improved Outcomes',
      description: 'Personalized care plans lead to better patient health and quality of life'
    }
  ];

  const team = [
    {
      name: 'Dr. Kadiri Adaba',
      role: 'CEO & Co-Founder',
      background: 'Wound care specialist with 15+ years of clinical experience',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Nenad Nedeljkovic',
      role: 'CTO & Co-Founder',
      background: 'AI researcher and engineering lead',
      image: ''
    }
  ];

  const milestones = [
    { year: '2020', event: 'DermaIQ founded by clinical and technical experts' },
    { year: '2021', event: 'First AI wound measurement algorithm developed' },
    { year: '2022', event: 'HIPAA compliance and SOC 2 certification achieved' },
    { year: '2023', event: '100+ healthcare organizations onboarded' },
    { year: '2024', event: '500+ providers using DermaIQ platform' },
    { year: '2025', event: 'Expanding to comprehensive wound care ecosystem' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>About DermaIQ</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            We're dedicated to improving the lives of polychronic patients and those with complex care needs
            through a seamless hybrid model of virtual and in-home care, powered by AI technology.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-fadeIn" ref={addToRefs}>
          <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
              alt="Healthcare team collaboration and medical innovation"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              We are dedicated to improving the lives of polychronic patients and those with complex care needs
              through a seamless hybrid model of virtual and in-home care. By integrating telehealth, remote monitoring,
              and in-person support, we provide comprehensive, coordinated care that enhances patient outcomes,
              reduces hospitalizations, and lowers costs.
            </p>

            <div className="bg-[#3681DE]/5 rounded-xl p-6 border border-[#3681DE]/30">
              <h3 className="text-lg font-semibold text-[#3681DE] mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Our Vision</h3>
              <p className="text-[#3681DE]" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                Our vision is to democratize access to advanced, data-driven healthcare for all, regardless of setting or resources.
                We envision a world where every wound receives optimal, data-driven care—regardless of setting or resources.
              </p>
            </div>
          </div>
        </div>

        {/* Hybrid Care Model */}
        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Transforming Care for Polychronic Patients</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Millions of people suffer from multiple chronic conditions, leading to fragmented care, frequent ER visits,
              and poor health outcomes. Our innovative hybrid care model addresses these challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hybridCareFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer animate-tada" ref={addToRefs}>
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{value.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Leadership Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer animate-slideInLeft flex-shrink-0" ref={addToRefs}>
                <img
                  src={`https://${index === 0 ? 'plus.unsplash.com/premium_photo-1661580632282-c56b1bfc0489?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                    index === 1 ? 'images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                      index === 2 ? '1559839734-2b71ea197ec2' :
                        '1612198188377-9c1960cd6c85'
                    }?auto=format&fit=crop&w=300&q=80`}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{member.name}</h3>
                <p className="text-[#3681DE] font-medium mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{member.role}</p>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{member.background}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Our Journey</h2>
          <div className="bg-[#3681DE]/5 rounded-2xl p-8">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 cursor-pointer animate-slideInLeft" ref={addToRefs}>
                  <div className="bg-[#3681DE] text-white w-16 h-16 rounded-full flex items-center justify-center font-bold" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center text-center animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Join Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Ready to transform wound care and chronic disease management in your organization?
            Let's co-design a solution that delivers results.
          </p>
          <button className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl animate-glow" ref={addToRefs}>
            Partner With Us
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;