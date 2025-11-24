import { useEffect, useRef } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, Brain, Zap, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Careers = () => {
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

  const benefits = [
    {
      icon: <Heart className="h-6 w-6 text-[#3681DE]" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: <DollarSign className="h-6 w-6 text-[#3681DE]" />,
      title: 'Competitive Compensation',
      description: 'Market-leading salaries, equity participation, and performance bonuses'
    },
    {
      icon: <Brain className="h-6 w-6 text-[#3681DE]" />,
      title: 'Learning & Growth',
      description: 'Professional development budget, conference attendance, and skill advancement'
    },
    {
      icon: <Clock className="h-6 w-6 text-[#3681DE]" />,
      title: 'Work-Life Balance',
      description: 'Flexible schedules, remote work options, and unlimited PTO policy'
    }
  ];

  const openPositions = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Lead the development of our AI wound analysis algorithms and computer vision systems.',
      requirements: ['5+ years in AI/ML', 'Computer vision experience', 'Python/TensorFlow', 'Healthcare domain knowledge preferred']
    },
    {
      title: 'Clinical Affairs Manager',
      department: 'Clinical',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Drive clinical validation studies and regulatory compliance for our wound care platform.',
      requirements: ['Clinical research experience', 'Regulatory affairs knowledge', 'Healthcare background', 'Project management skills']
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Design intuitive user experiences for healthcare professionals using our platform.',
      requirements: ['5+ years UX/UI design', 'Healthcare software experience', 'Figma/Sketch proficiency', 'User research skills']
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Ensure successful implementation and adoption of DermaIQ solutions at healthcare organizations.',
      requirements: ['Healthcare industry experience', 'Customer success background', 'Strong communication skills', 'Technical aptitude']
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Build and maintain secure, scalable infrastructure for our HIPAA-compliant platform.',
      requirements: ['DevOps/SRE experience', 'AWS/Azure expertise', 'Security compliance knowledge', 'Container orchestration']
    },
    {
      title: 'Clinical Data Scientist',
      department: 'Clinical',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Analyze clinical data to improve our AI models and generate insights for healthcare partners.',
      requirements: ['PhD in relevant field', 'Clinical data experience', 'Statistical analysis skills', 'R/Python proficiency']
    }
  ];

  const values = [
    {
      icon: <Users className="h-8 w-8 text-[#3681DE]" />,
      title: 'Collaborative Culture',
      description: 'We believe the best solutions come from diverse perspectives working together.'
    },
    {
      icon: <Zap className="h-8 w-8 text-[#3681DE]" />,
      title: 'Innovation Focus',
      description: 'We encourage experimentation and bold thinking to solve healthcare challenges.'
    },
    {
      icon: <Heart className="h-8 w-8 text-[#3681DE]" />,
      title: 'Patient Impact',
      description: 'Every role contributes to improving patient outcomes and healing experiences.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slideInLeft" ref={addToRefs}>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Careers at DermaIQ</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Join a mission-driven team that's transforming wound care through AI innovation
            and collaborative healthcare solutions.
          </p>
        </div>

        {/* Why Work Here */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-fadeIn" ref={addToRefs}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Why Work at DermaIQ?</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              We're building the future of wound care with a team of passionate healthcare professionals,
              AI researchers, and technology innovators. Join us in making a meaningful impact on
              patient outcomes while advancing your career.
            </p>

            <div className="space-y-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-[#3681DE]/5 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer animate-slideInLeft" ref={addToRefs}>
                  <div className="mt-1">{value.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{value.title}</h3>
                    <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80"
              alt="Healthcare technology team collaboration and innovation"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16 animate-zoomIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer animate-tada" ref={addToRefs}>
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{benefit.title}</h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16 animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow hover:scale-105 duration-300 cursor-pointer animate-slideInLeft" ref={addToRefs}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-[#3681DE]" />
                        <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{position.department}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-[#3681DE]" />
                        <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{position.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-[#3681DE]" />
                        <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{position.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="flex flex-row items-center mt-3 bg-[#3681DE] rounded-full text-white px-4 py-2 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl animate-glow" ref={addToRefs}>
                    Apply Now
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{position.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-[#3681DE]/5 rounded-2xl p-8 mb-16 animate-zoomIn hover:scale-105 transition-transform duration-300" ref={addToRefs}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Our Hiring Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center animate-tada" ref={addToRefs}>
              <div className="bg-[#3681DE] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Application</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Submit your resume and cover letter</p>
            </div>

            <div className="text-center animate-tada" ref={addToRefs}>
              <div className="bg-[#3681DE] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Phone Screen</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Initial conversation with our team</p>
            </div>

            <div className="text-center animate-tada" ref={addToRefs}>
              <div className="bg-[#3681DE] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Interviews</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Technical and cultural fit interviews</p>
            </div>

            <div className="text-center animate-tada" ref={addToRefs}>
              <div className="bg-[#3681DE] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Offer</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Welcome to the DermaIQ team!</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fadeIn" ref={addToRefs}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Ready to Make an Impact?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
            Don't see a role that fits? We're always looking for talented individuals who share our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex flex-row items-center bg-[#3681DE] rounded-full text-white px-6 py-3 font-semibold hover:bg-[#2B6BC7] transition-all duration-200 shadow-lg hover:shadow-xl animate-glow" ref={addToRefs}>
              View All Positions
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
            <button className="flex flex-row items-center border-2 border-[#3681DE] text-[#3681DE] px-6 py-3 rounded-full font-semibold hover:bg-[#3681DE]/10 transition-all duration-300 animate-wiggle" ref={addToRefs}>
              Send Us Your Resume
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;