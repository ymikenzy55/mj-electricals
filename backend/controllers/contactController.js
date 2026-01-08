const Contact = require('../models/Contact');

// Create contact message (Requires authentication)
const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, email, phone, subject, message)'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      user: req.user.id // Link to authenticated user
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
const getAllContactMessages = async (req, res) => {
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
      messages: contacts, // Frontend expects 'messages' property
      contacts, // Keep for backward compatibility
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

// Get user's own contact messages
const getUserContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      messages: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Respond to contact message (Admin only)
const respondToContact = async (req, res) => {
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

    // Send email notification to user
    try {
      const { sendEmail } = require('../config/email');
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B3D;">Response to Your Message</h2>
            <p>Hello ${contact.name},</p>
            <p>Thank you for contacting us. Here's our response to your inquiry:</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your Message:</strong></p>
              <p style="margin: 10px 0 0 0;">${contact.message}</p>
            </div>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B3D;">
              <p style="margin: 0;"><strong>Our Response:</strong></p>
              <p style="margin: 10px 0 0 0;">${response}</p>
            </div>
            
            <p>If you have any further questions, feel free to contact us again.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>MJ Electricals Team</strong></p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
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

// Delete contact message (Admin only)
const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
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
  getUserContactMessages,
  respondToContact,
  deleteContactMessage
};
