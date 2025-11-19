import React, { useState } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService, DonationRequest } from '../../demo/services/paymentService';
import { stripeOptions } from '../../config/stripe';
import { useStripe as useStripeHook } from '../../hooks/useStripe';

// Card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface StripePaymentFormProps {
  donation: DonationRequest;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<StripePaymentFormProps> = ({ donation, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { client_secret, payment_intent_id } = await paymentService.createPaymentIntent(donation);

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: donation.donor_name,
            email: donation.donor_email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        onError(stripeError.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(payment_intent_id);
      } else {
        setError('Payment was not completed. Please try again.');
        onError('Payment was not completed. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Card Information
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <div className="mt-3 flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Donate ${donation.amount}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted. We use Stripe to process payments.
      </p>
    </form>
  );
};

interface StripePaymentFormWrapperProps {
  donation: DonationRequest;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormWrapperProps> = ({ donation, onSuccess, onError }) => {
  const { stripe, loading, error } = useStripeHook();

  if (loading) {
    return (
      <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-center space-x-2 text-blue-800">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-semibold">Loading Payment System...</span>
        </div>
        <p className="mt-2 text-sm text-blue-700">
          Please wait while we initialize the secure payment system.
        </p>
      </div>
    );
  }

  if (error || !stripe) {
    return (
      <div className="p-6 border border-yellow-200 rounded-lg bg-yellow-50">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Payment System Unavailable</span>
        </div>
        <p className="mt-2 text-sm text-yellow-700">
          {error || 'Payment processing is not available. Please contact support.'}
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripe} options={stripeOptions}>
      <PaymentForm donation={donation} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripePaymentForm;
