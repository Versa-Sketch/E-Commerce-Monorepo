import RazorpayCheckout from 'react-native-razorpay';

export interface RazorpayLaunchOptions {
  key: string;
  orderId: string;
  amount: string;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpaySuccessResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Opens the Razorpay Checkout UI and resolves with the payment result.
 * Throws if the user cancels or the payment fails.
 */
export async function openRazorpayCheckout(options: RazorpayLaunchOptions): Promise<RazorpaySuccessResult> {
  const amountInPaise = Math.round(parseFloat(options.amount) * 100);
  const result = await RazorpayCheckout.open({
    key: options.key,
    order_id: options.orderId,
    amount: amountInPaise,
    currency: options.currency ?? 'INR',
    name: options.name ?? 'Localio',
    description: options.description ?? '',
    prefill: options.prefill,
    theme: options.theme ?? { color: '#208AEF' },
  });
  return {
    razorpay_order_id: result.razorpay_order_id,
    razorpay_payment_id: result.razorpay_payment_id,
    razorpay_signature: result.razorpay_signature,
  };
}
