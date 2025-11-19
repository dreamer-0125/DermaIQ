// Crypto payment service - backend endpoints not implemented

export interface CryptoDonationRequest {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_message?: string;
  crypto_symbol: string;
  crypto_address: string;
}

export interface CryptoDonationResponse {
  success: boolean;
  donation_id: string;
}

export interface CryptoDonationRecord {
  id: string;
  amount: number;
  currency: string;
  donor_name: string;
  donor_email: string;
  donor_message: string;
  donation_type: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  crypto_symbol: string;
  crypto_address: string;
  crypto_tx_hash?: string;
  crypto_amount?: number;
  crypto_confirmed_at?: string;
}

class CryptoPaymentService {
  /**
   * Create a crypto donation record
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async createCryptoDonation(_donation: CryptoDonationRequest): Promise<CryptoDonationResponse> {
    // console.warn('Crypto payment service not implemented - backend does not have payment endpoints');
    throw new Error('Crypto payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }

  /**
   * Get all crypto donations
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async getCryptoDonations(): Promise<CryptoDonationRecord[]> {
    // console.warn('Crypto payment service not implemented - backend does not have payment endpoints');
    throw new Error('Crypto payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }

  /**
   * Get crypto donation by ID
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async getCryptoDonationById(_donationId: string): Promise<CryptoDonationRecord> {
    // console.warn('Crypto payment service not implemented - backend does not have payment endpoints');
    throw new Error('Crypto payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }

  /**
   * Update crypto donation status (for admin use)
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async updateCryptoDonationStatus(
    _donationId: string, 
    _status: 'pending' | 'completed' | 'failed' | 'cancelled',
    _txHash?: string,
    _cryptoAmount?: number
  ): Promise<CryptoDonationRecord> {
    // console.warn('Crypto payment service not implemented - backend does not have payment endpoints');
    throw new Error('Crypto payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }
}

export const cryptoPaymentService = new CryptoPaymentService();
