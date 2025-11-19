import { FileText, Users, Shield, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4 mr-2" />
            Legal Terms & Conditions
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Agreement Overview
            </h2>
            <p className="text-blue-800 mb-0">
              These Terms of Service ("Terms") govern your use of the DermaIQ AI-powered wound care platform ("Service") 
              operated by DermaIQ, Inc. ("Company", "we", "us", or "our"). By accessing or using our Service, 
              you agree to be bound by these Terms.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Acceptance and Eligibility
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Who Can Use DermaIQ</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Licensed healthcare professionals and organizations</li>
                <li>Healthcare facilities with appropriate medical oversight</li>
                <li>Users who are at least 18 years of age</li>
                <li>Organizations that can enter into legally binding contracts</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Important:</strong> DermaIQ is intended for use by qualified healthcare professionals only. 
                It is not intended for direct patient use or self-diagnosis.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Service Description
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Core Services</h3>
                <ul className="list-disc pl-4 text-blue-800 text-sm">
                  <li>AI-powered wound measurement and analysis</li>
                  <li>Clinical decision support tools</li>
                  <li>Documentation and billing assistance</li>
                  <li>Care coordination platform</li>
                  <li>Progress tracking and reporting</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Platform Features</h3>
                <ul className="list-disc pl-4 text-green-800 text-sm">
                  <li>Mobile and web applications</li>
                  <li>EMR system integrations</li>
                  <li>Secure data storage and transmission</li>
                  <li>Analytics and insights dashboard</li>
                  <li>Clinical support and training</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Clinical Responsibility</h3>
                <p className="text-gray-700 mb-2">You acknowledge that:</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm">
                  <li>DermaIQ provides decision support tools, not medical diagnoses</li>
                  <li>All clinical decisions remain your professional responsibility</li>
                  <li>You will use the Service in accordance with applicable medical standards</li>
                  <li>You will maintain appropriate professional liability insurance</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Security</h3>
                <p className="text-gray-700 mb-2">You agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm">
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use strong passwords and enable two-factor authentication</li>
                  <li>Report any suspected security breaches immediately</li>
                  <li>Comply with your organization's data security policies</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Compliance</h3>
                <p className="text-gray-700 mb-2">You must:</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm">
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Obtain appropriate patient consents for data collection</li>
                  <li>Follow HIPAA and other privacy requirements</li>
                  <li>Use the Service only for legitimate healthcare purposes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
              Limitations and Disclaimers
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Medical Device Disclaimer</h3>
              <p className="text-yellow-800 text-sm">
                DermaIQ is a clinical decision support tool and is not intended to replace professional medical judgment. 
                The AI analysis should be used in conjunction with, not as a substitute for, clinical assessment by qualified healthcare professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Service Availability</h3>
                <p className="text-gray-700 text-sm">
                  We strive for 99.9% uptime but cannot guarantee uninterrupted service. 
                  Maintenance windows will be scheduled during off-peak hours when possible.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Data Accuracy</h3>
                <p className="text-gray-700 text-sm">
                  While our AI models are highly accurate, you are responsible for verifying 
                  all measurements and recommendations before making clinical decisions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">DermaIQ Property</h3>
                <p className="text-blue-800 text-sm">
                  The Service, including all software, algorithms, content, and trademarks, 
                  is owned by DermaIQ and protected by intellectual property laws.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Your Data</h3>
                <p className="text-green-800 text-sm">
                  You retain ownership of all patient data and clinical information you input into the Service. 
                  We use this data only as specified in our Privacy Policy and Business Associate Agreement.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment and Billing</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Subscription Terms</h3>
                  <ul className="list-disc pl-4 text-gray-700 text-sm">
                    <li>Monthly or annual billing cycles</li>
                    <li>Automatic renewal unless cancelled</li>
                    <li>30-day notice required for cancellation</li>
                    <li>Pro-rated refunds for annual subscriptions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Payment Processing</h3>
                  <ul className="list-disc pl-4 text-gray-700 text-sm">
                    <li>Secure payment processing via Stripe</li>
                    <li>Major credit cards and ACH accepted</li>
                    <li>Invoicing available for enterprise customers</li>
                    <li>Late payment fees may apply</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800">Termination by You</h3>
                <p className="text-gray-700 text-sm">
                  You may terminate your account at any time by contacting our support team. 
                  Data export assistance will be provided during a 30-day transition period.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">Termination by DermaIQ</h3>
                <p className="text-gray-700 text-sm">
                  We may terminate accounts for violations of these Terms, non-payment, 
                  or if required by law. We will provide reasonable notice when possible.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the State of California, without regard to conflict of law principles. 
                Any disputes will be resolved through binding arbitration in San Francisco, California.
              </p>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-700 text-sm">
                  By using DermaIQ, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions or Concerns?</h3>
            <p className="text-blue-800 text-sm mb-4">
              If you have questions about these Terms of Service, please contact our legal team:
            </p>
            <div className="space-y-1 text-blue-800 text-sm">
              <p><strong>Email:</strong> contact@dermaiq.org</p>
              <p><strong>Phone:</strong> +1 (404) 236-9566</p>
              <p><strong>Mail:</strong> DermaIQ Legal Department, 1345 Wiley Rd, Suite 111, Schaumburg, IL 60169</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;