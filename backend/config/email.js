// Email configuration for sending password reset codes
// TODO: Configure email service before production deployment

const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const createTransporter = () => {
  // Example configuration for Gmail
  // You'll need to enable "Less secure app access" or use App Password
  return nodemailer.createTransporter({
    service: 'gmail', // or 'smtp.gmail.com'
    auth: {
      user: process.env.EMAIL_USER, // Add to .env: your-email@gmail.com
      pass: process.env.EMAIL_PASSWORD // Add to .env: your-app-password
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
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
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send reset email');
  }
};

module.exports = {
  sendPasswordResetEmail
};
