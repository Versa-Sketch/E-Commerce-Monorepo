export interface PaymentSheetConfig {
  paymentIntentClientSecret: string;
  customerEphemeralKeySecret?: string;
  customerId?: string;
  merchantDisplayName?: string;
}
export const PaymentService = {
  initializePaymentSheet: async (amount: number, currency = 'inr'): Promise<PaymentSheetConfig> => {
    return {
      paymentIntentClientSecret: 'mock_payment_intent_secret_xyz789',
      customerEphemeralKeySecret: 'mock_ephemeral_key_123',
      customerId: 'mock_customer_id_456',
      merchantDisplayName: 'Localio Hyperlocal App',
    };
  },
  presentPaymentSheet: async (): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },
};
export default PaymentService;
