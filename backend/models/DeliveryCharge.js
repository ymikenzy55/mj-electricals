const mongoose = require('mongoose');

const deliveryChargeSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    unique: true
  },
  charge: {
    type: Number,
    required: [true, 'Delivery charge is required'],
    min: 0
  },
  estimatedDays: {
    type: Number,
    default: 3,
    min: 1
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
deliveryChargeSchema.index({ city: 1 });
deliveryChargeSchema.index({ active: 1 });

module.exports = mongoose.model('DeliveryCharge', deliveryChargeSchema);
