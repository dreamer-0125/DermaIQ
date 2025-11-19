import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Data Protection
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Our Commitment to Your Privacy
            </h2>
            <p className="text-blue-800 mb-0">
              DermaIQ is committed to protecting the privacy and security of your personal information and protected health information (PHI). 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered wound care platform.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Protected Health Information (PHI)</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Wound images and measurements</li>
              <li>Clinical assessments and treatment notes</li>
              <li>Patient demographics and medical history relevant to wound care</li>
              <li>Healthcare provider information and credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Device information and operating system</li>
              <li>IP address and location data (when permitted)</li>
              <li>Usage analytics and performance metrics</li>
              <li>Log files and error reports</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Name, email address, and professional credentials</li>
              <li>Organization and facility information</li>
              <li>Billing and payment information</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              How We Use Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Clinical Services</h3>
                <ul className="list-disc pl-4 text-gray-700 text-sm">
                  <li>AI-powered wound analysis and measurement</li>
                  <li>Clinical decision support and recommendations</li>
                  <li>Treatment tracking and progress monitoring</li>
                  <li>Care coordination and referral management</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Operations</h3>
                <ul className="list-disc pl-4 text-gray-700 text-sm">
                  <li>Account management and authentication</li>
                  <li>Technical support and troubleshooting</li>
                  <li>Platform improvements and updates</li>
                  <li>Compliance monitoring and reporting</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
              HIPAA Compliance
            </h2>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800 mb-4">
                <strong>DermaIQ is fully HIPAA compliant.</strong> We have implemented comprehensive administrative, physical, and technical safeguards to protect PHI:
              </p>
              <ul className="list-disc pl-6 text-green-800">
                <li>Business Associate Agreements (BAAs) with all healthcare partners</li>
                <li>End-to-end encryption for all data transmission and storage</li>
                <li>Role-based access controls and audit logging</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Employee training on HIPAA requirements and data handling</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information or PHI to third parties except in the following circumstances:
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">Healthcare Operations</h3>
                <p className="text-gray-700 text-sm">With authorized healthcare providers involved in your care, as permitted by HIPAA</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Service Providers</h3>
                <p className="text-gray-700 text-sm">With HIPAA-compliant vendors who assist in platform operations (cloud hosting, analytics)</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">Legal Requirements</h3>
                <p className="text-gray-700 text-sm">When required by law, court order, or to protect public health and safety</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Access & Portability</h3>
                <p className="text-blue-800 text-sm">Request copies of your PHI and transfer to other providers</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Correction</h3>
                <p className="text-green-800 text-sm">Request corrections to inaccurate or incomplete information</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Restriction</h3>
                <p className="text-purple-800 text-sm">Request limits on how we use or disclose your information</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Accounting</h3>
                <p className="text-orange-800 text-sm">Receive an accounting of disclosures of your PHI</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                For questions about this Privacy Policy or to exercise your rights, contact our Privacy Officer:
              </p>
              
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> contact@dermaiq.org</p>
                <p><strong>Phone:</strong> +1 (404) 236-9566</p>
                <p><strong>Mail:</strong> DermaIQ Privacy Officer, 1345 Wiley Rd, Suite 111, Schaumburg, IL 60169</p>
              </div>
            </div>
          </section>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Policy Updates
            </h3>
            <p className="text-yellow-800 text-sm">
              We may update this Privacy Policy periodically. We will notify you of any material changes by email 
              and by posting the updated policy on our website with a new effective date.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;