// src/lib/emailService.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Configure transporter based on environment
const getTransporter = () => {
  if (isDev && !process.env.GMAIL_USER) {
    // For development without email credentials, use a dummy test account
    console.log('Using development email transport - emails will be logged, not sent');
    return {
      sendMail: async (mailOptions) => {
        console.log('=============== EMAIL WOULD BE SENT ===============');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Content:', mailOptions.html ? '[HTML Content]' : mailOptions.text);
        console.log('===============================================');
        // Return success for dev environment
        return { 
          accepted: [mailOptions.to],
          rejected: [],
          response: 'Development mode - email logged to console' 
        };
      }
    };
  } else {
    // Use Gmail as transport
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password is recommended for Gmail
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
};

// Initialize transporter
const transporter = getTransporter();

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (user, verificationUrl) => {
  const mailOptions = {
    from: `"Website Builder" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #0ea5e9, #8b5cf6); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Email Verification</h1>
        </div>
        <div style="background: #1f2937; padding: 20px; color: #e5e7eb; border-radius: 0 0 8px 8px;">
          <p>Hi ${user.name},</p>
          <p>Thank you for signing up for Website Builder. To activate your account, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(to right, #0ea5e9, #8b5cf6); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #93c5fd;">${verificationUrl}</p>
          <p>This link will expire after 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #374151; margin: 20px 0;" />
          <p style="text-align: center; font-size: 12px; color: #9ca3af;">Website Builder | © ${new Date().getFullYear()}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetUrl) => {
  const mailOptions = {
    from: `"Website Builder" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #0ea5e9, #8b5cf6); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div style="background: #1f2937; padding: 20px; color: #e5e7eb; border-radius: 0 0 8px 8px;">
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(to right, #0ea5e9, #8b5cf6); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #93c5fd;">${resetUrl}</p>
          <p>This link will expire after 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #374151; margin: 20px 0;" />
          <p style="text-align: center; font-size: 12px; color: #9ca3af;">Website Builder | © ${new Date().getFullYear()}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};