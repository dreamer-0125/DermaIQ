import { useState, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { getStripe, isStripeReady } from '../config/stripe';

interface UseStripeReturn {
  stripe: Stripe | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for lazy loading Stripe API
 * Only loads Stripe when the hook is used (e.g., on donation page)
 */
export const useStripe = (): UseStripeReturn => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStripeAPI = async () => {
      try {
        if (!isStripeReady()) {
          setError('Stripe is not configured');
          setLoading(false);
          return;
        }

        // console.log('Loading Stripe API via useStripe hook...');
        const stripeInstance = await getStripe();
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err) {
        // console.error('Failed to load Stripe:', err);
        setError('Failed to load payment system');
        setLoading(false);
      }
    };

    loadStripeAPI();
  }, []);

  return { stripe, loading, error };
};

export default useStripe;
