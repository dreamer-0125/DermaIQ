import React, { useState } from 'react';
import { X, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '../../config/stripe';
import { API_CONFIG } from '../../config/api';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorMessage: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'system-ui, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
      padding: '12px',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

const CardPaymentForm: React.FC<Omit<CardPaymentModalProps, 'isOpen' | 'onClose'>> = ({
  amount,
  donorName,
  donorEmail,
  donorMessage,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>('');
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const handleCardChange = (field: keyof typeof cardComplete) => (event: any) => {
    setCardComplete(prev => ({ ...prev, [field]: event.complete }));
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
  };

  const isFormComplete = Object.values(cardComplete).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (!isFormComplete) {
      setCardError('Please complete all card fields');
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      // Create payment intent on backend
      const response = await fetch(`${API_CONFIG.BACKEND.getBaseUrl()}/api/donations/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          donor_name: donorName,
          donor_email: donorEmail,
          donor_message: donorMessage,
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the card payment
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donorName || 'Anonymous Donor',
            email: donorEmail,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Send support message email if message provided
        if (donorMessage.trim()) {
          await fetch(`${API_CONFIG.BACKEND.getBaseUrl()}/api/donations/send-support-message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              donor_name: donorName,
              donor_email: donorEmail,
              message: donorMessage,
              amount: amount,
            }),
          }).catch(err => {
            console.error('Failed to send support message:', err);
            // Don't fail the whole payment if email fails
          });
        }

        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      // console.error('Payment error:', err);
      onError(err.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange('cardNumber')}
            />
          </div>
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <CardExpiryElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange('cardExpiry')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <CardCvcElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange('cardCvc')}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {cardError && (
        <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Card Error</p>
            <p className="text-sm text-red-700 mt-1">{cardError}</p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <Lock className="w-4 h-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !isFormComplete}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Donate ${amount.toFixed(2)}</span>
          </>
        )}
      </button>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">Test Card for Demo</p>
        <p className="text-xs text-blue-700 font-mono">4242 4242 4242 4242</p>
        <p className="text-xs text-blue-700 mt-1">Use any future expiry date and any 3-digit CVC</p>
      </div>
    </form>
  );
};

const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  donorName,
  donorEmail,
  donorMessage,
  onSuccess,
  onError,
}) => {
  const [stripePromise] = useState(() => getStripe());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Your Donation</h2>
            <p className="text-sm text-gray-600 mt-1">Amount: ${amount.toFixed(2)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <Elements stripe={stripePromise}>
            <CardPaymentForm
              amount={amount}
              donorName={donorName}
              donorEmail={donorEmail}
              donorMessage={donorMessage}
              onSuccess={onSuccess}
              onError={onError}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentModal;
