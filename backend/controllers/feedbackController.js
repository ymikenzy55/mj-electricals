const Feedback = require('../models/Feedback');

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    const feedback = await Feedback.create({
      user: req.user.id,
      message
    });

    await feedback.populate('user', 'name email');

    // Emit real-time event to admins
    req.io.emit('feedback:new', feedback);

    res.status(201).json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user feedbacks
exports.getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id })
      .populate('respondedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all feedbacks (Admin only)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const skip = (page - 1) * limit;
    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email')
      .populate('respondedBy', 'name')
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      feedbacks,
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

// Respond to feedback (Admin only)
exports.respondToFeedback = async (req, res) => {
  try {
    const { response } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        response,
        status: 'responded',
        respondedBy: req.user.id,
        respondedAt: Date.now()
      },
      { new: true }
    ).populate('user', 'name email').populate('respondedBy', 'name');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Emit real-time event to user
    req.io.to(`user:${feedback.user._id}`).emit('feedback:response', feedback);

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete feedback (Admin only)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
