const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, deliveryCharge, totalAmount } = req.body;

    console.log('=== CREATE ORDER REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user?.id);

    // Validate user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required. Please log in again.'
      });
    }

    // Verify user exists in database
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User account not found. Please register or log in again.'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock
    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Deduct stock
      const previousStock = product.stock;
      product.stock -= item.quantity;
      await product.save();

      // Check for low stock or out of stock and notify admins
      const LOW_STOCK_THRESHOLD = 5;
      if (product.stock === 0) {
        // Out of stock notification
        req.io.emit('product:outOfStock', {
          productId: product._id,
          productName: product.name,
          productCode: product.productId,
          message: `${product.name} (${product.productId}) is now OUT OF STOCK`
        });
      } else if (product.stock <= LOW_STOCK_THRESHOLD && previousStock > LOW_STOCK_THRESHOLD) {
        // Low stock notification (only when crossing threshold)
        req.io.emit('product:lowStock', {
          productId: product._id,
          productName: product.name,
          productCode: product.productId,
          stock: product.stock,
          message: `${product.name} (${product.productId}) is running low - Only ${product.stock} left!`
        });
      }

      orderItems.push({
        product: product._id,
        productId: product.productId,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });

      calculatedSubtotal += product.price * item.quantity;
    }

    // Use provided values or calculated ones
    const finalSubtotal = subtotal || calculatedSubtotal;
    const finalDeliveryCharge = deliveryCharge || 0;
    const finalTotalAmount = totalAmount || (finalSubtotal + finalDeliveryCharge);

    console.log('Order totals:', { finalSubtotal, finalDeliveryCharge, finalTotalAmount });

    // Set payment expiry to 30 minutes from now
    const paymentExpiry = new Date();
    paymentExpiry.setMinutes(paymentExpiry.getMinutes() + 30);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal: finalSubtotal,
      deliveryCharge: finalDeliveryCharge,
      totalAmount: finalTotalAmount,
      customerInfo: {
        fullName: req.body.customerInfo?.fullName || req.user.name,
        phone: req.body.customerInfo?.phone || '',
        email: req.user.email
      },
      shippingAddress,
      paymentMethod: req.body.paymentMethod || 'pending',
      paymentInitiated: false,
      paymentExpiry: paymentExpiry
    });

    // Don't clear cart yet - wait for payment confirmation
    // Just add order to user's orders list
    const user = await User.findById(req.user.id);
    user.orders.push(order._id);
    await user.save();

    // Emit real-time event to admins
    req.io.emit('order:new', {
      order: await order.populate('user', 'name email')
    });

    console.log('Order created successfully:', order._id);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('=== CREATE ORDER ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    // Only show orders that are paid OR still within payment window
    const now = new Date();
    const orders = await Order.find({ 
      user: req.user.id,
      $or: [
        { paymentStatus: 'paid' },
        { paymentStatus: 'refunded' },
        { 
          paymentStatus: 'pending',
          paymentExpiry: { $gt: now }
        }
      ]
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user._id.toString() !== req.user.id && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const now = new Date();
    
    // Base query - exclude expired unpaid orders
    const query = {
      $or: [
        { paymentStatus: 'paid' },
        { paymentStatus: 'refunded' },
        { 
          paymentStatus: 'pending',
          paymentExpiry: { $gt: now }
        }
      ]
    };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Emit real-time event to user
    req.io.to(`user:${order.user._id}`).emit('order:statusUpdate', {
      orderId: order._id,
      status: order.status
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Cancel order (User only for pending orders)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}. Only pending orders can be cancelled.`
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Emit real-time event
    if (req.io) {
      req.io.emit('order:cancelled', {
        orderId: order._id,
        userId: order.user
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Process refund (Admin only)
exports.processRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is cancelled
    if (order.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Only cancelled orders can be refunded'
      });
    }

    // Check if already refunded
    if (order.refundStatus === 'processed') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been refunded'
      });
    }

    // Update refund status
    order.refundStatus = 'processed';
    order.refundedAt = new Date();
    order.refundedBy = req.user.id;
    order.paymentStatus = 'refunded';
    await order.save();

    // Emit real-time event to user
    if (req.io) {
      req.io.to(`user:${order.user._id}`).emit('order:refunded', {
        orderId: order._id,
        refundedAt: order.refundedAt
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      order
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cleanup expired unpaid orders (Admin only or cron job)
exports.cleanupExpiredOrders = async (req, res) => {
  try {
    const now = new Date();
    
    // Find expired unpaid orders
    const expiredOrders = await Order.find({
      paymentStatus: 'pending',
      paymentExpiry: { $lt: now }
    }).populate('items.product');

    let cleanedCount = 0;
    
    // Restore stock for each expired order
    for (const order of expiredOrders) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      
      // Mark as cancelled
      order.status = 'cancelled';
      order.paymentStatus = 'failed';
      await order.save();
      
      cleanedCount++;
    }

    res.json({
      success: true,
      message: `Cleaned up ${cleanedCount} expired orders`,
      count: cleanedCount
    });
  } catch (error) {
    console.error('Cleanup expired orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
