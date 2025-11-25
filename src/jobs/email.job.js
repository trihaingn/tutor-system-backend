/**
 * JOB: Email Notification Job
 * FILE: email.job.js
 * MỤC ĐÍCH: Xử lý gửi email thông báo (background task)
 * 
 * LIBRARY: node-cron hoặc Bull Queue
 * TRIGGER:
 * - Khi có request đăng ký môn học (UC-08)
 * - Khi confirm/reject appointment (UC-18, UC-19)
 * - Khi session bị hủy (UC-15)
 */

// TODO: Import dependencies
// const nodemailer = require('nodemailer')
// const emailConfig = require('../config/email.config')
// const { logger } = require('../utils/logger')

// ============================================================
// EMAIL TRANSPORTER
// ============================================================
// PURPOSE: Khởi tạo SMTP transporter
// 
// PSEUDOCODE:
// const transporter = nodemailer.createTransport({
//   host: emailConfig.smtp.host,
//   port: emailConfig.smtp.port,
//   secure: false, // Use STARTTLS
//   auth: {
//     user: emailConfig.smtp.auth.user,
//     pass: emailConfig.smtp.auth.pass
//   }
// })

// ============================================================
// SEND EMAIL FUNCTION
// ============================================================
// PURPOSE: Gửi email với template
// 
// INPUT:
// - to: String (email người nhận)
// - subject: String
// - html: String (HTML content)
// 
// PSEUDOCODE:
// const sendEmail = async (to, subject, html) => {
//   try {
//     if (!emailConfig.enabled) {
//       logger.info('Email feature disabled, skipping email send')
//       return { success: true, skipped: true }
//     }
//     
//     const mailOptions = {
//       from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
//       to: to,
//       subject: subject,
//       html: html
//     }
//     
//     const info = await transporter.sendMail(mailOptions)
//     
//     logger.info('Email sent successfully', {
//       to: to,
//       subject: subject,
//       messageId: info.messageId
//     })
//     
//     return { success: true, messageId: info.messageId }
//     
//   } catch (error) {
//     logger.error('Failed to send email', {
//       to: to,
//       subject: subject,
//       error: error.message
//     })
//     
//     return { success: false, error: error.message }
//   }
// }

// ============================================================
// EMAIL TEMPLATES
// ============================================================

// PURPOSE: Template khi có request đăng ký (UC-08)
// PSEUDOCODE:
// const getRegistrationRequestTemplate = (tutorName, studentName, subjectName) => {
//   return `
//     <h2>Yêu cầu đăng ký môn học mới</h2>
//     <p>Xin chào <strong>${tutorName}</strong>,</p>
//     <p>Sinh viên <strong>${studentName}</strong> đã gửi yêu cầu đăng ký môn <strong>${subjectName}</strong>.</p>
//     <p>Vui lòng đăng nhập hệ thống để xem chi tiết và phản hồi.</p>
//     <br>
//     <p>Trân trọng,</p>
//     <p><strong>HCMUT Tutor System</strong></p>
//   `
// }

// PURPOSE: Template khi tutor approve (UC-18)
// PSEUDOCODE:
// const getRegistrationApprovedTemplate = (studentName, tutorName, subjectName) => {
//   return `
//     <h2>Yêu cầu đăng ký được chấp nhận</h2>
//     <p>Xin chào <strong>${studentName}</strong>,</p>
//     <p>Yêu cầu đăng ký môn <strong>${subjectName}</strong> với giảng viên <strong>${tutorName}</strong> đã được chấp nhận.</p>
//     <p>Bạn có thể bắt đầu đặt lịch tư vấn với giảng viên.</p>
//     <br>
//     <p>Trân trọng,</p>
//     <p><strong>HCMUT Tutor System</strong></p>
//   `
// }

// PURPOSE: Template khi tutor reject (UC-19)
// PSEUDOCODE:
// const getRegistrationRejectedTemplate = (studentName, tutorName, subjectName, reason) => {
//   return `
//     <h2>Yêu cầu đăng ký bị từ chối</h2>
//     <p>Xin chào <strong>${studentName}</strong>,</p>
//     <p>Yêu cầu đăng ký môn <strong>${subjectName}</strong> với giảng viên <strong>${tutorName}</strong> đã bị từ chối.</p>
//     <p><strong>Lý do:</strong> ${reason}</p>
//     <p>Vui lòng liên hệ giảng viên hoặc tìm giảng viên khác.</p>
//     <br>
//     <p>Trân trọng,</p>
//     <p><strong>HCMUT Tutor System</strong></p>
//   `
// }

// PURPOSE: Template khi session bị hủy (UC-15)
// PSEUDOCODE:
// const getSessionCancelledTemplate = (recipientName, sessionTitle, startTime, reason) => {
//   return `
//     <h2>Buổi tư vấn bị hủy</h2>
//     <p>Xin chào <strong>${recipientName}</strong>,</p>
//     <p>Buổi tư vấn "<strong>${sessionTitle}</strong>" vào lúc <strong>${startTime}</strong> đã bị hủy.</p>
//     <p><strong>Lý do:</strong> ${reason}</p>
//     <p>Vui lòng đăng nhập hệ thống để đặt lịch buổi tư vấn mới.</p>
//     <br>
//     <p>Trân trọng,</p>
//     <p><strong>HCMUT Tutor System</strong></p>
//   `
// }

// ============================================================
// JOB HANDLERS
// ============================================================

// PURPOSE: Send registration request email (UC-08)
// PSEUDOCODE:
// const sendRegistrationRequestEmail = async (tutorEmail, data) => {
//   const { tutorName, studentName, subjectName } = data
//   
//   const subject = 'Yêu cầu đăng ký môn học mới'
//   const html = getRegistrationRequestTemplate(tutorName, studentName, subjectName)
//   
//   return await sendEmail(tutorEmail, subject, html)
// }

// PURPOSE: Send registration approved email (UC-18)
// PSEUDOCODE:
// const sendRegistrationApprovedEmail = async (studentEmail, data) => {
//   const { studentName, tutorName, subjectName } = data
//   
//   const subject = 'Yêu cầu đăng ký được chấp nhận'
//   const html = getRegistrationApprovedTemplate(studentName, tutorName, subjectName)
//   
//   return await sendEmail(studentEmail, subject, html)
// }

// PURPOSE: Send registration rejected email (UC-19)
// PSEUDOCODE:
// const sendRegistrationRejectedEmail = async (studentEmail, data) => {
//   const { studentName, tutorName, subjectName, reason } = data
//   
//   const subject = 'Yêu cầu đăng ký bị từ chối'
//   const html = getRegistrationRejectedTemplate(studentName, tutorName, subjectName, reason)
//   
//   return await sendEmail(studentEmail, subject, html)
// }

// PURPOSE: Send session cancelled email (UC-15)
// PSEUDOCODE:
// const sendSessionCancelledEmail = async (recipientEmail, data) => {
//   const { recipientName, sessionTitle, startTime, reason } = data
//   
//   const subject = 'Buổi tư vấn bị hủy'
//   const html = getSessionCancelledTemplate(recipientName, sessionTitle, startTime, reason)
//   
//   return await sendEmail(recipientEmail, subject, html)
// }

// ============================================================
// BULK EMAIL SENDER
// ============================================================
// PURPOSE: Gửi email cho nhiều recipients (notify all participants)
// 
// INPUT:
// - recipients: Array of { email, name }
// - subject: String
// - templateFn: Function
// - data: Object
// 
// PSEUDOCODE:
// const sendBulkEmails = async (recipients, subject, templateFn, data) => {
//   const results = []
//   
//   for (const recipient of recipients) {
//     const html = templateFn(recipient.name, data)
//     const result = await sendEmail(recipient.email, subject, html)
//     
//     results.push({
//       email: recipient.email,
//       success: result.success
//     })
//   }
//   
//   return results
// }

// ============================================================
// QUEUE INTEGRATION (Optional with Bull)
// ============================================================
// PURPOSE: Sử dụng Bull queue để xử lý email asynchronously
// 
// PSEUDOCODE:
// const Queue = require('bull')
// const emailQueue = new Queue('email', {
//   redis: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT
//   }
// })
// 
// // Process email jobs
// emailQueue.process(async (job) => {
//   const { type, to, data } = job.data
//   
//   switch (type) {
//     case 'REGISTRATION_REQUEST':
//       return await sendRegistrationRequestEmail(to, data)
//     case 'REGISTRATION_APPROVED':
//       return await sendRegistrationApprovedEmail(to, data)
//     case 'REGISTRATION_REJECTED':
//       return await sendRegistrationRejectedEmail(to, data)
//     case 'SESSION_CANCELLED':
//       return await sendSessionCancelledEmail(to, data)
//     default:
//       throw new Error(`Unknown email type: ${type}`)
//   }
// })
// 
// // Add email to queue
// const queueEmail = async (type, to, data) => {
//   await emailQueue.add({ type, to, data }, {
//     attempts: 3,
//     backoff: {
//       type: 'exponential',
//       delay: 2000
//     }
//   })
// }

// TODO: Export email job functions
// module.exports = {
//   sendEmail,
//   sendRegistrationRequestEmail,
//   sendRegistrationApprovedEmail,
//   sendRegistrationRejectedEmail,
//   sendSessionCancelledEmail,
//   sendBulkEmails,
//   // queueEmail (if using Bull)
// }
