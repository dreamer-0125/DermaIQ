import { Link } from 'react-router-dom';
import { Shield, Github } from 'lucide-react';
import { handleAnchorClick } from '../utils/scrollUtils';
import FaviconIcon from './ui/FaviconIcon';

// Social Media Icons as SVG components
const TwitterIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.405c-.315 0-.595-.122-.807-.315-.21-.21-.315-.49-.315-.807 0-.315.105-.595.315-.807.21-.21.49-.315.807-.315.315 0 .595.105.807.315.21.21.315.49.315.807 0 .315-.105.595-.315.807-.21.193-.49.315-.807.315zm-.122 1.58c-.928-.875-2.026-1.297-3.323-1.297s-2.448.49-3.323 1.297c-.928.875-1.418 2.026-1.418 3.323s.49 2.448 1.418 3.244c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.928-.796 1.418-1.947 1.418-3.244s-.49-2.448-1.418-3.323z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#3681DE] text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <FaviconIcon className="h-12 w-auto filter brightness-0 invert sm:scale-125" />
            </div>
            <p className="text-white mb-4 max-w-md leading-relaxed text-sm sm:text-base">
              Co-designing the future of wound care with AI-powered precision, clinical expertise, and seamless care coordination.
            </p>
            <div className="bg-white flex items-center space-x-2 text-xs sm:text-sm text-white bg-gray-800 px-3 sm:px-4 py-2 rounded-lg inline-flex mb-4">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
              <span className = "text-black font-bold">HIPAA Compliant & SOC 2 Certified</span>
            </div>
            <div className="text-xs sm:text-sm text-white">
              <p>A partnership approach to healthcare technology</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-white text-sm sm:text-base">Solutions</h3>
            <ul className="space-y-2 text-white">
              <li><Link to="/solutions/wound-measurement" className="hover:text-black transition-colors text-sm">AI Wound Measurement</Link></li>
              <li><Link to="/solutions/clinical-decision-support" className="hover:text-black transition-colors text-sm">Clinical Decision Support</Link></li>
              <li><Link to="/solutions/care-coordination" className="hover:text-black transition-colors text-sm">Care Coordination</Link></li>
              <li><Link to="/solutions/telehealth-integration" className="hover:text-black transition-colors text-sm">Telehealth Integration</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-white text-sm sm:text-base">Services</h3>
            <ul className="space-y-2 text-white">
              <li><a href="/services#core-services" onClick={(e) => handleAnchorClick(e, 'core-services')} className="hover:text-black transition-colors text-sm">Core Services</a></li>
              <li><a href="/services#care-navigation" onClick={(e) => handleAnchorClick(e, 'care-navigation')} className="hover:text-black transition-colors text-sm">Care Navigation</a></li>
              <li><a href="/services#delivery-channels" onClick={(e) => handleAnchorClick(e, 'delivery-channels')} className="hover:text-black transition-colors text-sm">Delivery Channels</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-white text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 text-white">
              <li><Link to="/contact" className="hover:text-black transition-colors text-sm">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-black transition-colors text-sm">Careers</Link></li>
              <li><Link to="/press" className="hover:text-black transition-colors text-sm">Press</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 border-opacity-10 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-white text-xs sm:text-sm text-center sm:text-left">&copy; 2025 DermaIQ. All rights reserved. Co-designed for healthcare excellence.</p>
              <div className="flex space-x-4 sm:space-x-6">
                <Link to="/privacy" className="text-white hover:text-black transition-colors text-xs sm:text-sm">Privacy Policy</Link>
                <Link to="/terms" className="text-white hover:text-black transition-colors text-xs sm:text-sm">Terms of Service</Link>
                <Link to="/security" className="text-white hover:text-black transition-colors text-xs sm:text-sm">Security</Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-white text-xs sm:text-sm">Follow us:</span>
              <div className="flex space-x-2 sm:space-x-3 items-center justify-center">
                <a 
                  href="https://twitter.com/dermaiq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors sm:p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center"
                  aria-label="Follow us on X (Twitter)"
                >
                  <TwitterIcon />
                </a>
                <a 
                  href="https://facebook.com/dermaiq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors sm:p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon />
                </a>
                <a 
                  href="https://instagram.com/dermaiq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400 transition-colors sm:p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon />
                </a>
                <a 
                  href="https://youtube.com/@dermaiq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-400 transition-colors sm:p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <YouTubeIcon />
                </a>
                <a 
                  href="https://github.com/dermaiq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors sm:p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center"
                  aria-label="View our GitHub repositories"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;