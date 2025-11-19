import React from 'react';
import { FooterLink } from './FooterLink';

interface FooterSectionProps {
  title: string;
  links: Array<{
    label: string;
    path: string;
  }>;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
  return (
    <div>
      <h3 className="font-bold mb-4 text-white text-sm sm:text-base">{title}</h3>
      <ul className="space-y-2 text-white">
        {links.map((link) => (
          <li key={link.path}>
            <FooterLink href={link.path}>
              {link.label}
            </FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { FooterSection };
