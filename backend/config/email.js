// Email configuration for sending password reset codes
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.error('⚠️ nodemailer not installed:', error.message);
  nodemailer = null;
}

// Create transporter
const createTransporter = () => {
  // Check if nodemailer is available
  if (!nodemailer) {
    console.warn('⚠️ nodemailer package not available');
    return null;
  }

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️ Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in environment variables.');
    return null;
  }

  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  try {
    const mailOptions = {
      from: `"MJ Electricals" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code - MJ Electricals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #FF6B3D 0%, #FF8C42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hello ${userName},</p>
            <p style="font-size: 16px; color: #333;">You requested to reset your password. Use the code below to reset your password:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h2 style="color: #FF6B3D; font-size: 32px; letter-spacing: 5px; margin: 0;">${resetToken}</h2>
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 30 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">MJ Electricals - Your Trusted Electronics Store</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('Failed to send reset email');
  }
};

module.exports = {
  sendPasswordResetEmail
};
