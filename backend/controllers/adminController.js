const User = require('../models/User');

// Get all users (Super Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
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

// Create admin (Super Admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user role (Super Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Deactivate user (Super Admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const Feedback = require('../models/Feedback');

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      pendingFeedbacks,
      totalRevenue,
      todayOrders,
      todayRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments({ 
        $or: [
          { paymentStatus: 'paid' },
          { paymentStatus: 'refunded' },
          { 
            paymentStatus: 'pending',
            paymentExpiry: { $gt: new Date() }
          }
        ]
      }),
      Order.countDocuments({ 
        status: 'pending',
        $or: [
          { paymentStatus: 'paid' },
          { 
            paymentStatus: 'pending',
            paymentExpiry: { $gt: new Date() }
          }
        ]
      }),
      Feedback.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { 
          $match: { 
            status: { $ne: 'cancelled' },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      // Today's orders count
      Order.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
        $or: [
          { paymentStatus: 'paid' },
          { 
            paymentStatus: 'pending',
            paymentExpiry: { $gt: new Date() }
          }
        ]
      }),
      // Today's revenue
      Order.aggregate([
        { 
          $match: { 
            status: { $ne: 'cancelled' },
            paymentStatus: 'paid',
            createdAt: { $gte: todayStart, $lte: todayEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        pendingFeedbacks,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders: todayOrders || 0,
        todayRevenue: todayRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get financial analytics
exports.getFinancialAnalytics = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const { date } = req.query; // Optional date filter (YYYY-MM-DD)

    let startDate, endDate;
    
    if (date) {
      // Specific date
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Today by default
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    // Get all orders for the date range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate metrics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'shipped').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Revenue calculations
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const paidRevenue = orders
      .filter(o => o.paymentStatus === 'paid' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const refundedAmount = orders
      .filter(o => o.refundStatus === 'processed')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingRevenue = orders
      .filter(o => o.status === 'pending')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Net revenue (paid - refunded)
    const netRevenue = paidRevenue - refundedAmount;

    // Get recent activities
    const recentActivities = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(order => ({
        id: order._id,
        type: 'order',
        status: order.status,
        amount: order.totalAmount,
        createdAt: order.createdAt,
        refundStatus: order.refundStatus
      }));

    res.json({
      success: true,
      analytics: {
        date: date || new Date().toISOString().split('T')[0],
        orders: {
          total: totalOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          pending: pendingOrders
        },
        revenue: {
          total: totalRevenue,
          paid: paidRevenue,
          refunded: refundedAmount,
          pending: pendingRevenue,
          net: netRevenue
        },
        recentActivities
      }
    });
  } catch (error) {
    console.error('Financial analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
