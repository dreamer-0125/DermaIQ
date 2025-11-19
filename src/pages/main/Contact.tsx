import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, Calendar, Users } from 'lucide-react';
import { BaseLayout, PageContainer, PageHeader, Section } from '../../components/layout';
import { usePageMetadata } from '../../hooks/usePageMetadata';

const Contact = () => {
  usePageMetadata({
    title: 'Contact DermaIQ - Get In Touch',
    description: 'Ready to transform your wound care practice? Contact our team to discuss how our AI-powered solutions can be customized for your organization.',
    keywords: ['contact', 'wound care', 'AI solutions', 'healthcare consultation', 'demo request']
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    title: '',
    message: '',
    serviceInterest: 'ai-measurement'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission

  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: 'Email Us',
      description: 'Get in touch with our team',
      contact: 'contact@dermaiq.org',
      action: 'Send Email'
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: 'Call Us',
      description: 'Speak with our experts',
      contact: '+1 (404) 236-9566',
      action: 'Call Now'
    },
    {
      icon: <MapPin className="h-6 w-6 text-purple-600" />,
      title: 'Visit Us',
      description: 'Our headquarters',
      contact: 'Schaumburg, IL',
      action: 'Get Directions'
    }
  ];

  const serviceOptions = [
    { value: 'ai-measurement', label: 'AI Wound Measurement' },
    { value: 'clinical-support', label: 'Clinical Decision Support' },
    { value: 'care-coordination', label: 'Care Coordination' },
    { value: 'telehealth', label: 'Telehealth Integration' },
    { value: 'custom-solution', label: 'Custom Solution Design' },
    { value: 'general-inquiry', label: 'General Inquiry' }
  ];

  return (
    <BaseLayout>
      <PageHeader
        title="Contact DermaIQ"
        description="Ready to transform your wound care practice? Let's discuss how our solutions can be customized for your organization's specific needs."
        breadcrumbs={[
          { label: 'Contact' }
        ]}
      />
      
      <PageContainer>
        {/* Contact Methods */}
        <Section padding="lg" background="white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="mb-4 flex justify-center">{method.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className="font-semibold text-gray-900 mb-4">{method.contact}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact Form */}
        <Section padding="lg" background="gray">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours. 
                We're here to answer your questions and help you get started.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Schedule a Demo</h3>
                    <p className="text-sm text-gray-600">See our solutions in action with a personalized demonstration</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Co-Design Session</h3>
                    <p className="text-sm text-gray-600">Work with our team to design your ideal wound care solution</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Consultation</h3>
                    <p className="text-sm text-gray-600">Get expert advice on optimizing your wound care workflows</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {serviceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your wound care needs and how we can help..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section padding="lg" background="blue">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How quickly can we get started?</h3>
                <p className="text-gray-600 text-sm">Most organizations can begin using our solutions within 2-4 weeks of initial consultation, depending on integration requirements.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you integrate with our EMR system?</h3>
                <p className="text-gray-600 text-sm">Yes, we support integration with major EMR systems including Epic, Cerner, and Allscripts through our API-first architecture.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What training is provided?</h3>
                <p className="text-gray-600 text-sm">We provide comprehensive training including live sessions, documentation, and ongoing support to ensure successful adoption.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Are your solutions HIPAA compliant?</h3>
                <p className="text-gray-600 text-sm">Yes, our solutions are fully HIPAA compliant with SOC 2 Type II certification and enterprise-grade security measures.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Office Information */}
        <Section padding="lg" background="white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" 
                  alt="Healthcare contact and medical consultation"
                  className="w-full h-32 object-cover rounded-xl shadow-md mb-4"
                />
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">DermaIQ</h3>
                <p className="text-gray-600">1345 Wiley Rd, Suite 111</p>
                <p className="text-gray-600">Schaumburg, IL 60169</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Business Hours:</p>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM CST</p>
                  <p>Saturday: 10:00 AM - 2:00 PM CST</p>
                  <p>Sunday: Closed</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contact Information:</p>
                  <p>Email: contact@dermaiq.org</p>
                  <p>Phone: +1 (404) 236-9566</p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </PageContainer>
    </BaseLayout>
  );
};

export default Contact;