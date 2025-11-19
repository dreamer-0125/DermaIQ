import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Check if Stripe is properly configured
const isStripeConfigured = stripePublishableKey && stripePublishableKey !== '';

if (!isStripeConfigured) {
  // console.warn('⚠️ Stripe not configured! Please set the following environment variable:');
  // console.warn('VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...');
  // console.warn('Create a .env file in the project root with this value.');
}

// Lazy load Stripe - only load when needed
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = async (): Promise<Stripe | null> => {
  if (!isStripeConfigured) {
    // console.warn('Stripe is not configured, returning null');
    return null;
  }
  
  if (!stripePromise) {
    // console.log('Loading Stripe API...');
    stripePromise = loadStripe(stripePublishableKey);
  }
  
  return stripePromise;
};

// Add a method to check if Stripe is configured
export const isStripeReady = () => isStripeConfigured;

// Stripe configuration options
export const stripeOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
        lineHeight: '1.5',
      },
      '.Input:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px',
      },
      '.Error': {
        color: '#ef4444',
        fontSize: '14px',
        marginTop: '4px',
      },
    },
  },
  loader: 'auto' as const,
};
