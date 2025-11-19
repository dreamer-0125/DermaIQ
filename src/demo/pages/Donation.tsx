import React, { useState } from 'react';
import { Heart, CreditCard, DollarSign, Users, Target, Shield, CheckCircle, AlertCircle, Coins } from 'lucide-react';
import DemoLayout from '../components/layout/DemoLayout';
import CardPaymentModal from '../../components/business/CardPaymentModal';

const Donation: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setDonationAmount(parseFloat(value) || 0);
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!donorEmail.trim() || donationAmount <= 0) {
      setPaymentError('Please fill in all required fields and select a valid donation amount.');
      return;
    }
    
    // Check if cryptocurrency is selected (disabled)
    if (paymentMethod === 'crypto') {
      setPaymentError('Cryptocurrency payments are coming soon. Please use credit card payment.');
      return;
    }
    
    setPaymentError('');
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    setIsSuccess(true);
    setShowPaymentModal(false);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowPaymentModal(false);
  };

  const resetForm = () => {
    setDonationAmount(25);
    setCustomAmount('');
    setDonorName('');
    setDonorEmail('');
    setDonorMessage('');
    setIsSuccess(false);
    setPaymentError('');
    setShowPaymentModal(false);
    setPaymentMethod('stripe');
  };

  const impactStats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Patients Helped',
      description: 'Through our AI-powered wound care platform'
    },
    {
      icon: Target,
      value: '95%',
      label: 'Accuracy Rate',
      description: 'In wound assessment and treatment planning'
    },
    {
      icon: Shield,
      value: '24/7',
      label: 'Care Access',
      description: 'Round-the-clock medical support available'
    }
  ];

  const donationTiers = [
    {
      amount: 25,
      title: 'Supporter',
      benefits: ['Thank you email', 'Platform updates', 'Impact report']
    },
    {
      amount: 50,
      title: 'Advocate',
      benefits: ['All Supporter benefits', 'Exclusive content access', 'Quarterly newsletter']
    },
    {
      amount: 100,
      title: 'Champion',
      benefits: ['All Advocate benefits', 'Priority support', 'Annual impact report']
    },
    {
      amount: 250,
      title: 'Partner',
      benefits: ['All Champion benefits', 'Direct team communication', 'Platform feature requests']
    }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your donation of ${donationAmount} has been received. Your support helps us continue 
            providing AI-powered wound care solutions to patients worldwide.
          </p>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              A confirmation email has been sent to {donorEmail}
            </p>
            {donorMessage && (
              <p className="text-xs text-green-700 mt-2">
                Thank you for sharing your message with us. We truly appreciate your support!
              </p>
            )}
          </div>
          
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <DemoLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Heart className="w-10 h-10 text-red-200" />
              <h1 className="text-4xl font-bold">Support Our Mission</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your donation helps us advance AI-powered wound care technology and make 
              quality healthcare accessible to patients worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
              
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          donationAmount === amount && customAmount === ''
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 text-gray-700'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share why you're supporting our mission..."
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Credit Card</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        paymentMethod === 'crypto'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <Coins className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Cryptocurrency</div>
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {paymentError && (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Payment Error</span>
                    </div>
                    <p className="mt-2 text-sm text-red-700">{paymentError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={donationAmount <= 0 || !donorEmail.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Continue to Card Payment - ${donationAmount}</span>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your donation is secure and will be processed through Stripe.
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Our Impact</h3>
              <div className="space-y-4">
                {impactStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Tiers */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Donation Tiers</h3>
              <div className="space-y-4">
                {donationTiers.map((tier, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{tier.title}</h4>
                      <span className="text-blue-600 font-bold">${tier.amount}</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* How Your Donation Helps */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How Your Donation Helps</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Advance AI technology for better wound assessment</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Provide free access to underserved communities</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Support research and development of new features</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Train healthcare providers on AI-powered tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={donationAmount}
        donorName={donorName}
        donorEmail={donorEmail}
        donorMessage={donorMessage}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </DemoLayout>
  );
};

export default Donation;