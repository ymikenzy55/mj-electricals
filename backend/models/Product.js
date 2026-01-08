const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    match: /^MJE-\d{6}$/
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  wattage: {
    type: Number,
    required: [true, 'Wattage is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  oldPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: 0,
    default: 0
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
productSchema.index({ category: 1, status: 1 }); // For category filtering
productSchema.index({ status: 1, featured: 1 }); // For featured products
productSchema.index({ name: 'text', description: 'text', category: 'text' }); // For search
productSchema.index({ price: 1 }); // For price filtering
productSchema.index({ createdAt: -1 }); // For sorting by newest

// Validate images array length (max 4 images)
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 4) {
    next(new Error('Maximum 4 images allowed per product'));
  }
  next();
});

// Generate unique product ID
productSchema.statics.generateProductId = async function() {
  let productId;
  let exists = true;
  
  while (exists) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    productId = `MJE-${randomNum}`;
    exists = await this.findOne({ productId });
  }
  
  return productId;
};

module.exports = mongoose.model('Product', productSchema);
