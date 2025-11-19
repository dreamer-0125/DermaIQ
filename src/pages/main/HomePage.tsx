import { BaseLayout } from '../../components/layout';
import Hero from '../../components/marketing/Hero';
import Features from '../../components/marketing/Features';
import HowItWorks from '../../components/marketing/HowItWorks';
import Benefits from '../../components/marketing/Benefits';
import Modern from '../../components/marketing/Modern';
import Built from '../../components/marketing/Built';
import { usePageMetadata } from '../../hooks/usePageMetadata';

const HomePage = () => {
  usePageMetadata({
    title: 'DermaIQ - AI-Powered Wound Care Solutions',
    description: 'Transform your wound care practice with AI-powered solutions. Comprehensive wound assessment, clinical decision support, and care coordination.',
    keywords: ['wound care', 'AI', 'healthcare', 'clinical decision support', 'care coordination', 'telehealth']
  });

  return (
    <BaseLayout>
      <Hero />
      <Features />
      <Modern />
      <Built />
      <HowItWorks />
      <Benefits />
    </BaseLayout>
  );
};

export default HomePage; 