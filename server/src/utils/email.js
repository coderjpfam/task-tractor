import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * Send welcome email to new user
 * @param {string} email - User email
 * @param {string} fullName - User full name
 * @param {string} tempPassword - Temporary password
 * @returns {Promise} Email send result
 */
export const sendWelcomeEmail = async (email, fullName, tempPassword) => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('Email configuration not set. Skipping email send.');
    console.log('Welcome email would be sent to:', email);
    console.log('Temporary password:', tempPassword);
    return { sent: false, message: 'Email not configured' };
  }

  const mailOptions = {
    from: `"Task Manager" <${EMAIL_FROM}>`,
    to: email,
    subject: 'Welcome to Task Manager - Your Account Has Been Created',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Task Manager</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #0f766e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Welcome to Task Manager!</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello ${fullName},</p>
          <p>Your account has been successfully created. You can now access the Task Manager system.</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0f766e;">
            <h3 style="margin-top: 0; color: #0f766e;">Your Login Credentials:</h3>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${tempPassword}</code></p>
          </div>
          
          <div style="background-color: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.</p>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>Task Manager Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Task Manager!

Hello ${fullName},

Your account has been successfully created. You can now access the Task Manager system.

Your Login Credentials:
Email: ${email}
Temporary Password: ${tempPassword}

Important: Please change your password after your first login for security purposes.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
Task Manager Team

This is an automated message. Please do not reply to this email.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Generate a random temporary password
 * @returns {string} Random password
 */
export const generateTempPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special char
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
