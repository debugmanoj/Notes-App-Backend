// src/utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for port 465, false for others like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, token) => {
const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify?token=${token}`;

  const mailOptions = {
    from: `"Notes App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Email Verification',
    html: `
      <h2>Verify Your Email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verificationLink}" target="_blank">${verificationLink}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw new Error("Failed to send verification email");
  }
};