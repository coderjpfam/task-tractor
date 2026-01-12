import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

// Email template configuration from environment variables
const COMPANY_NAME = process.env.COMPANY_NAME || 'Task Manager';
const APP_NAME = process.env.APP_NAME || 'Task Manager';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || SMTP_USER;
const HELP_URL = process.env.HELP_URL || '#';
const PRIVACY_URL = process.env.PRIVACY_URL || '#';
const CONTACT_URL = process.env.CONTACT_URL || '#';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

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
 * Email templates object containing all email templates
 * Use {{variableName}} syntax for variables that will be replaced
 */
export const emailTemplates = {
  welcome: {
    subject: "You're Invited to Join {{app_name}}",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invite User - {{app_name}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
                            <div style="width: 60px; height: 60px; background: #ffffff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2.5">
                                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                    <circle cx="8.5" cy="7" r="4"/>
                                    <line x1="20" y1="8" x2="20" y2="14"/>
                                    <line x1="23" y1="11" x2="17" y2="11"/>
                                </svg>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">You're Invited!</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px; color: #374151; line-height: 1.7;">
                            
                            <p style="font-size: 18px; color: #111827; margin: 0 0 20px; font-weight: 600;">Hi there,</p>
                            
                            <p style="font-size: 15px; margin: 0 0 20px; color: #4b5563;">
                                <strong style="color: #14b8a6;">{{inviter_name}}</strong> ({{inviter_role}}) has invited you to join <strong>{{company_name}}</strong> on {{app_name}} - our team collaboration and project management platform.
                            </p>

                            <!-- Invitation Details Box -->
                            <table role="presentation" style="width: 100%; background: #f0fdfa; border-left: 4px solid #14b8a6; border-radius: 6px; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #ccfbf1;">
                                                    <table role="presentation" style="width: 100%;">
                                                        <tr>
                                                            <td style="font-weight: 600; color: #0f766e; font-size: 14px;">Company:</td>
                                                            <td style="text-align: right; color: #374151; font-size: 14px;">{{company_name}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #ccfbf1;">
                                                    <table role="presentation" style="width: 100%;">
                                                        <tr>
                                                            <td style="font-weight: 600; color: #0f766e; font-size: 14px;">Your Email:</td>
                                                            <td style="text-align: right; color: #374151; font-size: 14px;">{{user_email}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #ccfbf1;">
                                                    <table role="presentation" style="width: 100%;">
                                                        <tr>
                                                            <td style="font-weight: 600; color: #0f766e; font-size: 14px;">Role:</td>
                                                            <td style="text-align: right; color: #374151; font-size: 14px;">{{assigned_role}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <table role="presentation" style="width: 100%;">
                                                        <tr>
                                                            <td style="font-weight: 600; color: #0f766e; font-size: 14px;">Department:</td>
                                                            <td style="text-align: right; color: #374151; font-size: 14px;">{{department_name}}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Personal Message (if provided) -->
                            <table role="presentation" style="width: 100%; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 600;">💬 Personal Message from {{inviter_name}}:</p>
                                        <p style="margin: 10px 0 0; font-size: 14px; color: #374151; font-style: italic;">
                                            "{{personal_message}}"
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 15px; margin: 25px 0 20px; color: #4b5563;">
                                With {{app_name}}, you'll be able to:
                            </p>

                            <!-- Feature List -->
                            <table role="presentation" style="width: 100%; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="vertical-align: top; padding-right: 12px; color: #14b8a6; font-size: 18px;">✓</td>
                                                <td style="font-size: 14px; color: #4b5563;">Manage and track tasks efficiently</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="vertical-align: top; padding-right: 12px; color: #14b8a6; font-size: 18px;">✓</td>
                                                <td style="font-size: 14px; color: #4b5563;">Collaborate with your team in real-time</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="vertical-align: top; padding-right: 12px; color: #14b8a6; font-size: 18px;">✓</td>
                                                <td style="font-size: 14px; color: #4b5563;">Track time and manage attendance</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="vertical-align: top; padding-right: 12px; color: #14b8a6; font-size: 18px;">✓</td>
                                                <td style="font-size: 14px; color: #4b5563;">Monitor project progress and deadlines</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="vertical-align: top; padding-right: 12px; color: #14b8a6; font-size: 18px;">✓</td>
                                                <td style="font-size: 14px; color: #4b5563;">Apply for leaves and submit timesheets</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Warning Box -->
                            <table role="presentation" style="width: 100%; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; font-size: 14px; color: #92400e;">
                                            <strong>⏰ This invitation expires in 7 days.</strong> Accept your invitation and set up your account before {{expiry_date}}.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{{invitation_url}}" style="display: inline-block; padding: 16px 40px; background: #14b8a6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);">
                                            Accept Invitation & Set Up Account →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="font-size: 13px; color: #6b7280; margin: 20px 0; text-align: center;">
                                Or copy and paste this link into your browser:<br>
                                <a href="{{invitation_url}}" style="color: #14b8a6; word-break: break-all; font-size: 12px;">{{invitation_url}}</a>
                            </p>

                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                            <p style="font-size: 14px; color: #6b7280; margin: 15px 0;">
                                If you weren't expecting this invitation or believe it was sent by mistake, you can safely ignore this email.
                            </p>

                            <p style="font-size: 14px; color: #6b7280; margin: 15px 0;">
                                Questions? Contact <a href="mailto:{{support_email}}" style="color: #14b8a6; text-decoration: none;">{{support_email}}</a>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 5px; font-size: 13px; color: #6b7280;">© 2024 {{app_name}}. All rights reserved.</p>
                            <table role="presentation" style="margin: 15px auto 0;">
                                <tr>
                                    <td style="padding: 0 12px;">
                                        <a href="{{help_url}}" style="color: #14b8a6; text-decoration: none; font-size: 13px; font-weight: 600;">Help Center</a>
                                    </td>
                                    <td style="padding: 0 12px;">
                                        <a href="{{privacy_url}}" style="color: #14b8a6; text-decoration: none; font-size: 13px; font-weight: 600;">Privacy Policy</a>
                                    </td>
                                    <td style="padding: 0 12px;">
                                        <a href="{{contact_url}}" style="color: #14b8a6; text-decoration: none; font-size: 13px; font-weight: 600;">Contact Us</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
    text: `
You're Invited to Join {{app_name}}!

Hi there,

{{inviter_name}} ({{inviter_role}}) has invited you to join {{company_name}} on {{app_name}} - our team collaboration and project management platform.

Invitation Details:
-------------------
Company: {{company_name}}
Your Email: {{user_email}}
Role: {{assigned_role}}
Department: {{department_name}}

Personal Message from {{inviter_name}}:
"{{personal_message}}"

With {{app_name}}, you'll be able to:
• Manage and track tasks efficiently
• Collaborate with your team in real-time
• Track time and manage attendance
• Monitor project progress and deadlines
• Apply for leaves and submit timesheets

⏰ IMPORTANT: This invitation expires in 7 days. Accept your invitation and set up your account before {{expiry_date}}.

Accept your invitation by clicking the link below:
{{invitation_url}}

Or copy and paste this link into your browser:
{{invitation_url}}

---

If you weren't expecting this invitation or believe it was sent by mistake, you can safely ignore this email.

Questions? Contact {{support_email}}

© 2024 {{app_name}}. All rights reserved.
Help Center: {{help_url}}
Privacy Policy: {{privacy_url}}
Contact Us: {{contact_url}}
    `
  }
  // Add more templates here as needed
  // passwordReset: { ... }
  // passwordChanged: { ... }
};

/**
 * Get template by key and replace variables with provided values
 * @param {string} templateKey - Key of the template in emailTemplates object
 * @param {Object} variables - Object containing variable name-value pairs to replace
 * @returns {Object} Template object with subject, html, and text with variables replaced
 * @throws {Error} If template key doesn't exist
 */
export const getTemplate = (templateKey, variables = {}) => {
  const template = emailTemplates[templateKey];
  
  if (!template) {
    throw new Error(`Template with key "${templateKey}" not found`);
  }

  // Replace variables in subject, html, and text
  const replaceVariables = (str) => {
    let result = str;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }
    return result;
  };

  return {
    subject: replaceVariables(template.subject),
    html: replaceVariables(template.html),
    text: replaceVariables(template.text)
  };
};

/**
 * Send email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {string} text - Plain text content of the email (optional)
 * @returns {Promise<Object>} Email send result with sent status and messageId
 */
export const sendMail = async (to, subject, html, text = '') => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('Email configuration not set. Skipping email send.');
    console.log('Email would be sent to:', to);
    console.log('Subject:', subject);
    return { sent: false, message: 'Email not configured' };
  }

  const mailOptions = {
    from: `"{{app_name}}" <${EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: html,
    text: text || html.replace(/<[^>]*>/g, '') // Convert HTML to text if text not provided
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email (invitation email) to new user
 * @param {string} userEmail - User email address
 * @param {string} inviterName - Name of the person who invited the user
 * @param {string} inviterRole - Role of the person who invited the user
 * @param {string} assignedRole - Role assigned to the new user
 * @param {string} departmentName - Department name
 * @param {string} personalMessage - Optional personal message from inviter (default: empty string)
 * @param {string} invitationUrl - URL to the registration page
 * @returns {Promise} Email send result
 */
export const sendWelcomeEmail = async (
  userEmail,
  inviterName,
  inviterRole,
  assignedRole,
  departmentName,
  personalMessage = '',
  invitationUrl = `${CLIENT_URL}/register?email=${encodeURIComponent(userEmail)}`
) => {
  // Calculate expiry date (7 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const template = getTemplate('welcome', {
    inviter_name: inviterName,
    inviter_role: inviterRole,
    company_name: COMPANY_NAME,
    user_email: userEmail,
    assigned_role: assignedRole,
    department_name: departmentName,
    personal_message: personalMessage || 'Welcome to the team! We\'re excited to have you on board.',
    expiry_date: formattedExpiryDate,
    invitation_url: invitationUrl,
    support_email: SUPPORT_EMAIL,
    help_url: HELP_URL,
    privacy_url: PRIVACY_URL,
    contact_url: CONTACT_URL
  });

  return await sendMail(userEmail, template.subject, template.html, template.text);
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
