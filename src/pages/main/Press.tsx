import { Newspaper, Calendar, ExternalLink, Award } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Press = () => {
  const pressReleases = [
    {
      date: 'January 15, 2025',
      title: 'DermaIQ Announces $25M Series A Funding to Accelerate AI-Powered Wound Care Innovation',
      excerpt: 'Funding will support expansion of clinical partnerships and development of next-generation wound assessment technologies.',
      category: 'Funding',
      link: '#'
    },
    {
      date: 'December 8, 2024',
      title: 'DermaIQ Partners with Mayo Clinic for Large-Scale Clinical Validation Study',
      excerpt: 'Multi-year partnership will validate AI wound measurement accuracy across diverse patient populations.',
      category: 'Partnership',
      link: '#'
    },
    {
      date: 'November 22, 2024',
      title: 'DermaIQ Achieves SOC 2 Type II Certification, Reinforcing Commitment to Data Security',
      excerpt: 'Certification demonstrates DermaIQ\'s dedication to maintaining the highest standards of data protection.',
      category: 'Security',
      link: '#'
    },
    {
      date: 'October 10, 2024',
      title: 'DermaIQ Surpasses 500 Healthcare Providers Using AI Wound Care Platform',
      excerpt: 'Milestone reflects growing adoption of AI-powered wound assessment technology across healthcare systems.',
      category: 'Milestone',
      link: '#'
    },
    {
      date: 'September 5, 2024',
      title: 'DermaIQ Launches Telehealth Integration for Remote Wound Monitoring',
      excerpt: 'New capabilities enable healthcare providers to monitor wound healing progress remotely with AI precision.',
      category: 'Product',
      link: '#'
    }
  ];

  const mediaKit = [
    {
      title: 'Company Logos',
      description: 'High-resolution DermaIQ logos in various formats',
      type: 'ZIP File'
    },
    {
      title: 'Product Screenshots',
      description: 'Screenshots of the DermaIQ platform and mobile app',
      type: 'ZIP File'
    },
    {
      title: 'Executive Headshots',
      description: 'Professional photos of DermaIQ leadership team',
      type: 'ZIP File'
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key facts, figures, and company information',
      type: 'PDF'
    }
  ];

  const awards = [
    {
      year: '2024',
      award: 'Healthcare Innovation Award',
      organization: 'Digital Health Awards',
      description: 'Recognized for breakthrough AI wound measurement technology'
    },
    {
      year: '2024',
      award: 'Best AI Healthcare Solution',
      organization: 'MedTech Breakthrough Awards',
      description: 'Honored for advancing AI applications in clinical care'
    },
    {
      year: '2023',
      award: 'Emerging Company of the Year',
      organization: 'Healthcare Technology Report',
      description: 'Acknowledged for rapid growth and clinical impact'
    }
  ];

  const mediaContacts = [
    {
      name: 'Sarah Johnson',
      title: 'VP of Marketing',
      email: 'contact@dermaiq.org',
      phone: '+1 (404) 236-9566'
    },
    {
      name: 'Media Relations Team',
      title: 'General Inquiries',
      email: 'contact@dermaiq.org',
      phone: '+1 (404) 236-9566'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4 mr-2" />
            Press & Media
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Press Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and developments from DermaIQ 
            as we transform wound care through AI innovation.
          </p>
        </div>

        {/* Latest News */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {release.date}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        release.category === 'Funding' ? 'bg-green-100 text-green-800' :
                        release.category === 'Partnership' ? 'bg-blue-100 text-blue-800' :
                        release.category === 'Security' ? 'bg-purple-100 text-purple-800' :
                        release.category === 'Milestone' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {release.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600 mb-4">{release.excerpt}</p>
                  </div>
                  <button className="mt-4 lg:mt-0 lg:ml-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Read More
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-12 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">DermaIQ at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Healthcare Providers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Wounds Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">AI Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$25M</div>
              <div className="text-blue-100">Series A Funding</div>
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 mb-2">{award.year}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{award.award}</h3>
                <p className="text-blue-600 font-medium mb-3">{award.organization}</p>
                <p className="text-gray-600 text-sm">{award.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Kit</h2>
            <div className="space-y-4">
              {mediaKit.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">{item.type}</span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Contacts</h2>
            <div className="space-y-6">
              {mediaContacts.map((contact, index) => (
                <div key={index} className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">{contact.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{contact.title}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Email: <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700">{contact.email}</a></p>
                    <p>Phone: <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-700">{contact.phone}</a></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our press updates to receive the latest news, announcements, 
            and developments from DermaIQ directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Press;