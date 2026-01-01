const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
    default: 'pending'
  },
  customerInfo: {
    fullName: String,
    phone: String,
    email: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentReference: {
    type: String
  },
  paidAt: {
    type: Date
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed'],
    default: 'none'
  },
  refundedAt: {
    type: Date
  },
  refundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentInitiated: {
    type: Boolean,
    default: false
  },
  paymentExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

// Add index for cleanup queries
orderSchema.index({ paymentStatus: 1, paymentExpiry: 1 });

module.exports = mongoose.model('Order', orderSchema);
