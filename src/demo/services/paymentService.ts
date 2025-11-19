// Payment service - backend endpoints not implemented

export interface DonationRequest {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_message?: string;
  currency?: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export interface DonationStats {
  total_amount: number;
  total_count: number;
  average_donation: number;
}

export interface DonationRecord {
  id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  donor_name: string;
  donor_email: string;
  donor_message: string;
  donation_type: string;
  status: 'completed' | 'failed' | 'pending';
  created_at: string;
  stripe_charge_id?: string;
  payment_method?: string;
  failure_reason?: string;
}

class PaymentService {
  /**
   * Create a payment intent for donation
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async createPaymentIntent(_donation: DonationRequest): Promise<PaymentIntentResponse> {
    // console.warn('Payment service not implemented - backend does not have payment endpoints');
    throw new Error('Payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }

  /**
   * Get all donations (admin only)
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async getDonations(): Promise<DonationRecord[]> {
    // console.warn('Payment service not implemented - backend does not have payment endpoints');
    throw new Error('Payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }

  /**
   * Get donation statistics
   * NOTE: Payment endpoints are not currently implemented in the backend
   */
  async getDonationStats(): Promise<DonationStats> {
    // console.warn('Payment service not implemented - backend does not have payment endpoints');
    throw new Error('Payment functionality is not currently available. Backend payment endpoints are not implemented.');
  }
}

export const paymentService = new PaymentService();
