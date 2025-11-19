import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, QrCode, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cryptoConfig, getCryptoConfig } from '../../config/crypto';
import { cryptoPaymentService, CryptoDonationRequest } from '../../demo/services/cryptoPaymentService';

interface CryptoPaymentFormProps {
  donation: {
    amount: number;
    donor_name: string;
    donor_email: string;
    donor_message?: string;
  };
  onSuccess: (cryptoData: CryptoDonationData) => void;
  onError: (error: string) => void;
}

export interface CryptoDonationData {
  crypto_symbol: string;
  crypto_address: string;
  amount_usd: number;
  donor_name: string;
  donor_email: string;
  donor_message?: string;
  status: 'pending' | 'completed';
  created_at: string;
}

const CryptoPaymentForm: React.FC<CryptoPaymentFormProps> = ({ donation, onSuccess, onError }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('btc');
  const [copiedAddress, setCopiedAddress] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const config = getCryptoConfig(selectedCrypto);
  if (!config) {
    onError('Invalid cryptocurrency selected');
    return null;
  }

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
    setCopiedAddress('');
    setShowQRCode(false);
    setQrCodeDataUrl('');
  };

  // Generate QR code when crypto is selected or QR code is shown
  useEffect(() => {
    if (showQRCode && config) {
      // For now, we'll use a placeholder QR code
      // In production, you would use a QR code library like 'qrcode'
      setQrCodeDataUrl(`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black">QR Code</text></svg>`);
    }
  }, [showQRCode, selectedCrypto, donation.amount, donation.donor_name]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(config.address);
      setCopiedAddress(selectedCrypto);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      onError('Failed to copy address to clipboard');
    }
  };

  const handleOpenExplorer = () => {
    window.open(`${config.explorerUrl}${config.address}`, '_blank');
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create crypto donation request
      const cryptoDonationRequest: CryptoDonationRequest = {
        amount: donation.amount,
        donor_name: donation.donor_name,
        donor_email: donation.donor_email,
        donor_message: donation.donor_message,
        crypto_symbol: selectedCrypto.toUpperCase(),
        crypto_address: config.address
      };

      // Store in Supabase
      await cryptoPaymentService.createCryptoDonation(cryptoDonationRequest);
      
      // Create crypto donation data for success callback
      const cryptoDonationData: CryptoDonationData = {
        crypto_symbol: selectedCrypto.toUpperCase(),
        crypto_address: config.address,
        amount_usd: donation.amount,
        donor_name: donation.donor_name,
        donor_email: donation.donor_email,
        donor_message: donation.donor_message,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      onSuccess(cryptoDonationData);
    } catch (err: any) {
      onError(err.message || 'Failed to process crypto donation');
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Crypto Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Cryptocurrency
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(cryptoConfig).map(([symbol, crypto]) => (
            <button
              key={symbol}
              onClick={() => handleCryptoSelect(symbol)}
              className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                selectedCrypto === symbol
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              <div className="text-2xl mb-1" style={{ color: crypto.color }}>
                {crypto.icon}
              </div>
              <div className="text-sm">{crypto.symbol}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: config.color }}
          >
            {config.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{config.name} Payment</h3>
            <p className="text-sm text-gray-600">Send exactly ${donation.amount} USD worth</p>
          </div>
        </div>

        {/* Address Display */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.symbol} Address
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={config.address}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={handleCopyAddress}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy address"
              >
                {copiedAddress === selectedCrypto ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Show QR code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                onClick={handleOpenExplorer}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="View on blockchain explorer"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* QR Code */}
          {showQRCode && (
            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <div className="text-center">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Payment QR Code" 
                    className="w-48 h-48 rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <div className="text-gray-500 text-sm">Generating QR Code...</div>
                  </div>
                )}
                <p className="text-xs text-gray-600">Scan to send payment</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Instructions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Copy the {config.symbol} address above</li>
            <li>2. Send exactly ${donation.amount} USD worth of {config.symbol}</li>
            <li>3. Click "Confirm Payment" after sending</li>
            <li>4. We'll verify your payment and send a confirmation email</li>
          </ol>
        </div>

        {/* Important Notes */}
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important:</p>
              <ul className="space-y-1">
                <li>• Only send {config.symbol} to this address</li>
                <li>• Double-check the address before sending</li>
                <li>• Payments may take 10-30 minutes to confirm</li>
                <li>• Contact support if you have any issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleConfirmPayment}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Confirm Payment</span>
            </>
          )}
        </button>
      </div>

      {/* Status Info */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>Payment status will be updated once confirmed on the blockchain</span>
      </div>
    </div>
  );
};

export default CryptoPaymentForm;
