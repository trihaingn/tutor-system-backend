/**
 * CONFIG: Email Configuration
 * FILE: email.config.js
 * MỤC ĐÍCH: Cấu hình SMTP để gửi email notifications
 * 
 * ENVIRONMENT VARIABLES:
 * - EMAIL_HOST: SMTP server host
 * - EMAIL_PORT: SMTP port (587 for TLS, 465 for SSL)
 * - EMAIL_USER: SMTP username
 * - EMAIL_PASSWORD: SMTP password
 * - EMAIL_FROM: Sender email address
 * 
 * NOTE: Feature này là OPTIONAL trong version 1.0
 */

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// EMAIL CONFIGURATION
// ============================================================
// PURPOSE: Export email/SMTP settings
// 
// PSEUDOCODE:
// const emailConfig = {
//   // SMTP Server Settings
//   smtp: {
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: parseInt(process.env.EMAIL_PORT) || 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL_USER || '',
//       pass: process.env.EMAIL_PASSWORD || ''
//     },
//     tls: {
//       rejectUnauthorized: false // Allow self-signed certificates
//     }
//   },
//   
//   // Sender Information
//   from: {
//     name: 'HCMUT Tutor System',
//     address: process.env.EMAIL_FROM || 'noreply@tutor.hcmut.edu.vn'
//   },
//   
//   // Email Templates
//   templates: {
//     appointmentConfirmed: 'appointment-confirmed',
//     appointmentRejected: 'appointment-rejected',
//     sessionCancelled: 'session-cancelled',
//     newRegistration: 'new-registration',
//     evaluationReceived: 'feedback-received'
//   },
//   
//   // Feature Flag
//   enabled: process.env.ENABLE_EMAIL === 'true' || false
// }

// ============================================================
// EMAIL TEMPLATES EXAMPLE
// ============================================================
// PURPOSE: Structure của email templates
// 
// TEMPLATE: appointment-confirmed
// {
//   subject: 'Buổi học đã được xác nhận',
//   html: `
//     <h2>Xin chào {{studentName}},</h2>
//     <p>Buổi học của bạn đã được xác nhận:</p>
//     <ul>
//       <li>Môn học: {{subjectName}}</li>
//       <li>Giảng viên: {{tutorName}}</li>
//       <li>Thời gian: {{sessionTime}}</li>
//       <li>Link: {{meetingLink}}</li>
//     </ul>
//   `
// }

// ============================================================
// NODEMAILER SETUP (if implementing)
// ============================================================
// PURPOSE: Tạo transporter để gửi email
// 
// PSEUDOCODE:
// const nodemailer = require('nodemailer')
// 
// const createTransporter = () => {
//   if (!emailConfig.enabled) {
//     return null
//   }
//   
//   return nodemailer.createTransport(emailConfig.smtp)
// }
// 
// const sendEmail = async (options) => {
//   if (!emailConfig.enabled) {
//     console.log('[EMAIL] Email notifications disabled')
//     return
//   }
//   
//   const transporter = createTransporter()
//   
//   const mailOptions = {
//     from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
//     to: options.to,
//     subject: options.subject,
//     html: options.html
//   }
//   
//   try {
//     await transporter.sendMail(mailOptions)
//     console.log(`[EMAIL] Sent to ${options.to}`)
//   } catch (error) {
//     console.error('[EMAIL] Failed to send:', error)
//   }
// }

// TODO: Export configuration
// module.exports = {
//   emailConfig,
//   createTransporter,
//   sendEmail
// }
