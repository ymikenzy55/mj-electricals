const axios = require('axios');
const Order = require('../models/Order');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize payment
exports.initializePayment = async (req, res) => {
  try {
    const { orderId, email, amount } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    // Mark payment as initiated
    order.paymentInitiated = true;
    await order.save();

    // Get callback URL from environment or use default
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
    const callbackUrl = `${baseUrl}/pages/payment-success.html?orderId=${orderId}`;

    // Initialize Paystack transaction
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        reference: `MJE-${orderId}-${Date.now()}`,
        metadata: {
          orderId,
          userId: req.user.id,
          custom_fields: [
            {
              display_name: 'Order ID',
              variable_name: 'order_id',
              value: orderId
            }
          ]
        },
        callback_url: callbackUrl
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Payment initialization failed';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Payment gateway timeout. Please try again.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to payment gateway. Please try again later.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      code: error.code
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify transaction with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const { data } = response.data;

    if (data.status === 'success') {
      // Update order payment status
      const orderId = data.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order) {
        order.paymentStatus = 'paid';
        order.paymentReference = reference;
        order.paidAt = new Date();
        order.status = 'processing'; // Move to processing after payment
        await order.save();

        // Emit socket event
        if (req.io) {
          req.io.to(`user:${order.user}`).emit('payment:success', {
            orderId: order._id,
            amount: data.amount / 100
          });
        }
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId,
          amount: data.amount / 100,
          reference: data.reference,
          paidAt: data.paid_at
        }
      });
    } else {
      // Payment was not successful
      const orderId = data.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'failed';
          order.paymentReference = reference;
          await order.save();
        }
      }
      
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        status: data.status
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Payment verification failed';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Verification timeout. Please try again.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to payment gateway. Please try again later.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      code: error.code
    });
  }
};

// Webhook handler for Paystack
exports.paystackWebhook = async (req, res) => {
  try {
    const hash = require('crypto')
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        const orderId = event.data.metadata.orderId;
        const order = await Order.findById(orderId);
        
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.paymentReference = event.data.reference;
          order.paidAt = new Date();
          await order.save();

          // Emit socket event
          if (req.io) {
            req.io.to(`user:${order.user}`).emit('payment:success', {
              orderId: order._id,
              amount: event.data.amount / 100
            });
          }
        }
        break;

      case 'charge.failed':
        // Handle failed payment
        console.log('Payment failed:', event.data);
        break;

      default:
        console.log('Unhandled event:', event.event);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
      paymentStatus: 'paid'
    })
      .select('_id totalAmount paymentReference paidAt')
      .sort('-paidAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
