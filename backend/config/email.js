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

  // Check if SMTP credentials are configured
  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const smtpPort = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ Email credentials not configured');
    return null;
  }

  try {
    // Use SMTP2GO or custom SMTP if configured, otherwise fall back to Gmail
    if (smtpHost && smtpPort) {
      console.log(`📧 Using SMTP: ${smtpHost}:${smtpPort}`);
      return nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: false, // Use TLS
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      // Fallback to Gmail
      console.log('📧 Using Gmail SMTP');
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000
      });
    }
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
    const fromEmail = process.env.SMTP_USER || process.env.EMAIL_USER;
    const mailOptions = {
      from: `"MJ Electricals" <${fromEmail}>`,
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
