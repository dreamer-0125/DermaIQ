import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Cpu,
  Network,
  Zap,
  Database,
  CheckCircle,
  Calendar
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TechBase = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'architecture' | 'technology' | 'roadmap'>('overview');
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b animate-slideInLeft" ref={addToRefs}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Tech Base</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
              Pioneering AI-powered healthcare technology built on advanced MCP infrastructure,
              with our ultimate goal of developing a proprietary healthcare LLM using Byte Latent Transformer architecture.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b animate-slideInLeft" ref={addToRefs}>
        <div className="w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: Brain },
              { id: 'architecture', label: 'Architecture', icon: Zap },
              { id: 'technology', label: 'Technology', icon: Cpu },
              { id: 'roadmap', label: 'Roadmap', icon: Calendar }
            ].map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-fit flex items-center mb-3 space-x-2 px-6 py-3 rounded-full text-sm font-medium  transition-all  duration-300 hover:scale-105 hover:shadow-lg ${activeSection === section.id
                    ? 'bg-[#3681DE] text-white shadow-xl'
                    : 'text-gray-600 hover:text-[#3681DE] hover:bg-[#3681DE]/5 border border-gray-200 hover:border-[#3681DE]/30'
                    }`}
                  style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}
                >
                  <IconComponent className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-[#3681DE]'}`} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-12 animate-fadeIn" ref={addToRefs}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Core Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#3681DE]/5 rounded-xl p-8 border-2 border-[#3681DE]/30 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-8 h-8 text-[#3681DE]" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>BLT</h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Bytes Latency Transformer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Low-latency, edge-optimized large language model architecture</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#3681DE]" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Low-latency inference</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#3681DE]" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Edge-optimized architecture</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#3681DE]/5 rounded-xl p-8 border-2 border-[#3681DE]/30 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <div className="flex items-center space-x-3 mb-4">
                  <Network className="w-8 h-8 text-[#3681DE]" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>MCP</h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Model Context Protocol</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Standard for context packaging, model orchestration, and state management</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#3681DE]" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Context packaging</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#3681DE]" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Model orchestration</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#3681DE]/5 rounded-xl p-8 border-2 border-[#3681DE]/30 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-8 h-8 text-[#3681DE]" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>MCP Server</h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Execution + Routing Layer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Execution and routing layer for AI modules, managing compute, storage, and communication</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#3681DE]" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>AI module execution</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#3681DE]" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Compute management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'architecture' && (
          <div className="space-y-8 animate-fadeIn" ref={addToRefs}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>System Architecture</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                Understanding how our core components work together to deliver AI-powered healthcare solutions
              </p>
            </div>

            {/* Engine Layer */}
            <div className="bg-white rounded-xl p-8 shadow-lg border hover:scale-105 transition-transform duration-300 animate-slideInLeft" ref={addToRefs}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Engine Layer</h3>
              <div className="bg-[#3681DE] rounded-xl p-6 text-white mb-6">
                <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>BLT LLM + MCP = Engine</h4>
                <p className="text-blue-100" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>The Engine is the AI reasoning + orchestration core that powers applications</p>
              </div>
            </div>

            {/* OS Layer */}
            <div className="bg-white rounded-xl p-8 shadow-lg border hover:scale-105 transition-transform duration-300 animate-slideInLeft" ref={addToRefs}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Operating System Layer</h3>
              <div className="bg-[#3681DE] rounded-xl p-6 text-white mb-6">
                <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>BLT LLM + MCP + MCP Server = Yovac OS</h4>
                <p className="text-blue-100" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>A super-lightweight AI-native operating system for edge devices and offline-first use cases</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'technology' && (
          <div className="space-y-8 animate-zoomIn" ref={addToRefs}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Technology Stack</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                Our comprehensive technology foundation built on cutting-edge AI research and healthcare-specific infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <Brain className="h-8 w-8 text-[#3681DE] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>AI Foundation Models</h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Advanced neural networks for wound care analysis and clinical decision support</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-[#3681DE] mr-2" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Computer Vision Models</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-[#3681DE] mr-2" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Natural Language Processing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer animate-wiggle" ref={addToRefs}>
                <Network className="h-8 w-8 text-[#3681DE] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>MCP Infrastructure</h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Model Context Protocol servers for seamless AI tool integration and workflow automation</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-[#3681DE] mr-2" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Custom MCP Server</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-[#3681DE] mr-2" />
                    <span style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Healthcare-specific Tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'roadmap' && (
          <div className="space-y-8 animate-fadeIn" ref={addToRefs}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Technology Roadmap</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                Our development timeline for building the next generation of AI-powered healthcare technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl border-2 border-[#3681DE]/30 bg-[#3681DE]/5 hover:scale-105 transition-transform duration-300 animate-slideInLeft" ref={addToRefs}>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 bg-[#3681DE]/20 text-[#3681DE]" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                  Completed
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Phase 1</h3>
                <h4 className="font-semibold text-gray-800 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Foundation AI Models</h4>
                <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Foundation AI models for wound measurement and classification</p>
                <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Completed</p>
              </div>

              <div className="p-6 rounded-xl border-2 border-[#3681DE]/30 bg-[#3681DE]/5 hover:scale-105 transition-transform duration-300 animate-slideInLeft" ref={addToRefs}>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 bg-[#3681DE]/20 text-[#3681DE]" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>
                  In Progress
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>Phase 2</h3>
                <h4 className="font-semibold text-gray-800 mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>MCP Server & Tool Integration</h4>
                <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>MCP server and healthcare tool integration</p>
                <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'ITC Avant Garde Gothic Std, sans-serif' }}>July-August 2024</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TechBase;