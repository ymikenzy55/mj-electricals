const Contact = require('../models/Contact');

// Create contact message (Public - no auth required)
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Emit real-time event to admins
    if (req.io) {
      req.io.emit('contact:new', contact);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all contact messages (Admin only)
exports.getAllContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const skip = (page - 1) * limit;
    const contacts = await Contact.find(query)
      .populate('respondedBy', 'name')
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
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

// Respond to contact message (Admin only)
exports.respondToContact = async (req, res) => {
  try {
    const { response } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        response,
        status: 'responded',
        respondedBy: req.user.id,
        respondedAt: Date.now()
      },
      { new: true }
    ).populate('respondedBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  respondToContact
};
