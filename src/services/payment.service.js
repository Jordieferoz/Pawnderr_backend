import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (INR)
 * @param {string} currency - Currency code (default: 'INR')
 * @param {object} options - Additional options
 */
export const createOrder = async (amount, currency = 'INR', options = {}) => {
  try {
    const orderOptions = {
      amount: amount * 100, // Convert rupees to paise
      currency,
      receipt: options.receipt || `receipt_${Date.now()}`,
      notes: options.notes || {},
    };

    const order = await razorpay.orders.create(orderOptions);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 */
export const verifyPayment = (orderId, paymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    const isAuthentic = generatedSignature === signature;

    return {
      success: isAuthentic,
      message: isAuthentic ? 'Payment verified successfully' : 'Invalid payment signature',
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100, // Convert paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        orderId: payment.order_id,
        customerId: payment.customer_id,
        createdAt: payment.created_at,
      },
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (optional, full amount if not provided)
 */
export const refundPayment = async (paymentId, amount = null) => {
  try {
    const refundOptions = amount
      ? { amount: amount * 100 } // Convert rupees to paise
      : {};

    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    return {
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100, // Convert paise to rupees
        status: refund.status,
        createdAt: refund.created_at,
      },
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
};

