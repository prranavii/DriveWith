import { Request, Response } from 'express';
import { inMemoryStore } from '../config/db';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount } = req.body;
    const razorpayOrderId = `order_${Date.now()}`;

    const newPayment = {
      id: `p-${Date.now()}`,
      booking_id: bookingId,
      amount: parseFloat(amount) || 500,
      payment_status: 'PENDING',
      payment_method: 'RAZORPAY_MOCK',
      transaction_id: razorpayOrderId,
      created_at: new Date().toISOString(),
    };

    inMemoryStore.payments.push(newPayment);

    res.status(201).json({
      message: 'Razorpay Mock Order Created',
      order: {
        id: razorpayOrderId,
        amount: newPayment.amount * 100, // in paise
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_drivewith123',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, paymentId = `pay_${Date.now()}` } = req.body;
    const payment = inMemoryStore.payments.find(p => p.booking_id === bookingId);
    if (payment) {
      payment.payment_status = 'SUCCESS';
      payment.transaction_id = paymentId;
    }
    res.json({ message: 'Payment verified successfully', paymentId, status: 'SUCCESS' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
