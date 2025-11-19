import React from 'react';
import { FooterSection } from './FooterSection';
import { SocialLinks } from './SocialLinks';
import { Shield } from 'lucide-react';
import FaviconIcon from '../../ui/FaviconIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const solutionsLinks = [
    { label: 'AI Wound Measurement', path: '/solutions/wound-measurement' },
    { label: 'Clinical Decision Support', path: '/solutions/clinical-decision-support' },
    { label: 'Care Coordination', path: '/solutions/care-coordination' },
    { label: 'Telehealth Integration', path: '/solutions/telehealth-integration' },
  ];

  const servicesLinks = [
    { label: 'Core Services', path: '/services#core-services' },
    { label: 'Care Navigation', path: '/services#care-navigation' },
    { label: 'Delivery Channels', path: '/services#delivery-channels' },
  ];

  const companyLinks = [
    { label: 'Contact', path: '/contact' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Security', path: '/security' },
  ];

  return (
    <footer className="bg-[#3681DE] text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <FaviconIcon className="h-12 w-auto filter brightness-0 invert sm:scale-125" />
            </div>
            <p className="text-white mb-4 max-w-md leading-relaxed text-sm sm:text-base">
              Co-designing the future of wound care with AI-powered precision, clinical expertise, and seamless care coordination.
            </p>
            <div className="bg-white flex items-center space-x-2 text-xs sm:text-sm text-white bg-gray-800 px-3 sm:px-4 py-2 rounded-lg inline-flex mb-4">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
              <span className="text-black font-bold">HIPAA Compliant & SOC 2 Certified</span>
            </div>
            <div className="text-xs sm:text-sm text-white">
              <p>A partnership approach to healthcare technology</p>
            </div>
          </div>

          {/* Solutions */}
          <FooterSection title="Solutions" links={solutionsLinks} />

          {/* Services */}
          <FooterSection title="Services" links={servicesLinks} />

          {/* Company */}
          <FooterSection title="Company" links={companyLinks} />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 border-opacity-10 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-white text-xs sm:text-sm text-center sm:text-left">
                &copy; {currentYear} DermaIQ. All rights reserved. Co-designed for healthcare excellence.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                {legalLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className="text-white hover:text-black transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
