import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { ApiError } from './ApiError.js';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const generateOTP = async () => {
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
};

export const sendSuperAdminMail = async (to, OTP) => {
  try {
    await transporter.sendMail({
      from: `"Scribo" <${process.env.EMAIL_USER}>`,
      to,
      subject: `${OTP} is your Scribo verification code`,
      text: `Your Scribo verification code is: ${OTP}. This code expires in 5 minutes.`, // Fallback for non-HTML clients
      html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify your email</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table width="400" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td style="padding: 32px 32px 20px 32px;">
                                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">Scribo</h1>
                                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #f97316; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Every line counts.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 32px 32px 32px;">
                                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                                            To complete your institution registration, please use the following verification code:
                                        </p>
                                        <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 24px; text-align: center;">
                                            <span style="font-family: 'JetBrains Mono', 'Roboto Mono', monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #f97316;">${OTP}</span>
                                        </div>
                                        <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #9ca3af; text-align: center;">
                                            This code will expire in <span style="color: #111827; font-weight: 500;">5 minutes</span>. <br>
                                            If you didn't request this, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
                                        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                                            &copy; ${new Date().getFullYear()} Scribo Inc. Built for competitive programming.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `,
    });
  } catch (error) {
    console.error('Email Send Error:', error);
    throw new Error(
      'Could not send verification email. Please check your credentials.'
    );
  }
};

export const sendVerificationMail = async (to, verificationPayload) => {
  const isLink =
    typeof verificationPayload === 'string' &&
    verificationPayload.startsWith('http');
  const subject = isLink
    ? 'Verify your Scribo email'
    : `${verificationPayload} is your Scribo verification code`;
  const text = isLink
    ? `Welcome to Scribo! Verify your email using this link: ${verificationPayload}`
    : `Welcome to Scribo! Your verification code is: ${verificationPayload}. Valid for 5 minutes.`;

  try {
    await transporter.sendMail({
      from: `"Scribo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your Scribo Account</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table width="400" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 32px 32px 20px 32px;">
                                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">Scribo</h1>
                                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #f97316; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Welcome to the arena.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 32px 32px 32px;">
                                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                                        ${isLink ? 'To finish setting up your account and start coding, verify your email using the button below:' : 'To finish setting up your account and start coding, please enter the code below:'}
                                    </p>
                                    ${isLink ? `<div style="text-align: center;"><a href="${verificationPayload}" style="display:inline-block;padding:12px 20px;border-radius:10px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:700;">Verify Email</a></div>` : `<div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 24px; text-align: center;"><span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #f97316;">${verificationPayload}</span></div>`}
                                    <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #9ca3af; text-align: center;">
                                        ${isLink ? 'This verification link expires in <span style="color: #111827; font-weight: 500;">24 hours</span>.' : 'This setup code expires in <span style="color: #111827; font-weight: 500;">5 minutes</span>.'}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                                        &copy; ${new Date().getFullYear()} Scribo Inc. • Every line counts.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Registration Mail Error:', error);
    throw new Error('Could not send registration email.');
  }
};

export const sendLoginOTPMail = async (to, OTP) => {
  try {
    await transporter.sendMail({
      from: `"Scribo Security" <${process.env.EMAIL_USER}>`,
      to,
      subject: `${OTP} is your Scribo login code`,
      text: `Your Scribo login code is: ${OTP}. If you did not request this, please secure your account.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Scribo Login Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table width="400" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 32px 32px 20px 32px;">
                                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">Scribo</h1>
                                    <p style="margin: 4px 0 0 0; font-size: 10px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Security Verification</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 32px 32px 32px;">
                                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                                        A login attempt was made for your Scribo account. Use this code to verify your identity:
                                    </p>
                                    <div style="background-color: #111827; border-radius: 12px; padding: 24px; text-align: center;">
                                        <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${OTP}</span>
                                    </div>
                                    <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 18px; color: #ef4444; text-align: center; font-weight: 500;">
                                        If you didn't try to log in, someone else may have your password. Please change it immediately after logging in.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                                        Scribo Security Team • ${new Date().getFullYear()}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Login Mail Error:', error);
    throw new Error('Could not send security email.');
  }
};
