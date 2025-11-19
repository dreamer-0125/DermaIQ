import { Shield, Lock, Eye, Server, CheckCircle, AlertTriangle, Users, FileText } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Security = () => {
  const securityFeatures = [
    {
      icon: <Lock className="h-8 w-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "HIPAA Compliance",
      description: "Full HIPAA compliance with Business Associate Agreements and comprehensive safeguards"
    },
    {
      icon: <Eye className="h-8 w-8 text-purple-600" />,
      title: "Access Controls",
      description: "Role-based access controls with multi-factor authentication and audit logging"
    },
    {
      icon: <Server className="h-8 w-8 text-orange-600" />,
      title: "Secure Infrastructure",
      description: "SOC 2 Type II certified cloud infrastructure with 99.9% uptime guarantee"
    }
  ];

  const certifications = [
    { name: "HIPAA Compliant", status: "Certified", color: "green" },
    { name: "SOC 2 Type II", status: "Certified", color: "blue" },
    { name: "ISO 27001", status: "In Progress", color: "yellow" },
    { name: "FedRAMP", status: "Planned", color: "gray" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise-Grade Security
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Security & Compliance</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DermaIQ is built with security at its core. We implement comprehensive safeguards to protect 
            your sensitive healthcare data and ensure regulatory compliance.
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* HIPAA Compliance Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-white">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">HIPAA Compliance</h2>
              <p className="text-blue-100 text-lg max-w-3xl mx-auto">
                DermaIQ meets all HIPAA requirements for protecting Protected Health Information (PHI) 
                with comprehensive administrative, physical, and technical safeguards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Administrative</h3>
                <p className="text-blue-100 text-sm">Security policies, training, and access management procedures</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Physical</h3>
                <p className="text-blue-100 text-sm">Secure data centers with biometric access and 24/7 monitoring</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Server className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Technical</h3>
                <p className="text-blue-100 text-sm">Encryption, access controls, and audit logging systems</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Data Protection Measures</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=800&q=80" 
                alt="Data security and protection"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Encryption Everywhere</h3>
                  <p className="text-gray-600 text-sm">All data is encrypted using industry-standard AES-256 encryption at rest and TLS 1.3 in transit.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-lg p-2">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Trust Architecture</h3>
                  <p className="text-gray-600 text-sm">Every access request is verified and authenticated, regardless of location or user credentials.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Security Audits</h3>
                  <p className="text-gray-600 text-sm">Quarterly penetration testing and annual third-party security assessments.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 rounded-lg p-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Logging</h3>
                  <p className="text-gray-600 text-sm">All system activities are logged and monitored for suspicious behavior and compliance reporting.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Certifications & Compliance</h2>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    cert.color === 'green' ? 'bg-green-100 text-green-800' :
                    cert.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    cert.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cert.color === 'green' || cert.color === 'blue' ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-1" />
                    )}
                    {cert.status}
                  </div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Infrastructure Security */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Infrastructure Security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Server className="w-6 h-6 mr-2 text-blue-600" />
                Cloud Infrastructure
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">AWS/Azure multi-region deployment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Automated backup and disaster recovery</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">99.9% uptime SLA with monitoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">DDoS protection and WAF</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-green-600" />
                Access Security
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Multi-factor authentication (MFA)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Role-based access controls (RBAC)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Single Sign-On (SSO) integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Session management and timeout</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Incident Response */}
        <section className="mb-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Incident Response & Business Continuity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-4">24/7 Security Monitoring</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Real-time threat detection and alerting</li>
                  <li>• Automated incident response procedures</li>
                  <li>• Security Operations Center (SOC) monitoring</li>
                  <li>• Immediate breach notification protocols</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-4">Business Continuity</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Automated daily backups with point-in-time recovery</li>
                  <li>• Multi-region failover capabilities</li>
                  <li>• Recovery Time Objective (RTO): &lt; 4 hours</li>
                  <li>• Recovery Point Objective (RPO): &lt; 1 hour</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Security Team */}
        <section className="text-center">
          <div className="bg-gray-900 rounded-2xl p-12 text-white">
            <Shield className="h-16 w-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl font-bold mb-4">Security Questions?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Our security team is available to answer questions about our security practices, 
              compliance certifications, or to discuss your organization's specific security requirements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Security Team
              </button>
              <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Request Security Documentation
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Security Email</p>
                  <p className="text-white">support@dermaiq.org</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Vulnerability Reports</p>
                  <p className="text-white">support@dermaiq.org</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Emergency Hotline</p>
                  <p className="text-white">+1 (404) 236-9566</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Security;