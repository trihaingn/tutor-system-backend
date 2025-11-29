/**
 * ROUTES: Route Aggregator
 * FILE: index.js
 * MỤC ĐÍCH: Mount tất cả sub-routes vào main router
 * 
 * API VERSION: v1
 * BASE PATH: /api/v1
 * 
 * SUB-ROUTES:
 * - /auth           -> auth.routes.js
 * - /registrations  -> registration.routes.js
 * - /sessions       -> session.routes.js
 * - /schedules      -> schedule.routes.js
 * - /students       -> student.routes.js
 * - /tutors         -> tutor.routes.js
 * - /notifications  -> notification.routes.js
 * - /record       -> record.routes.js
 * - /evaluations    -> feedback-rating.routes.js
 */

// TODO: Import express.Router
// TODO: Import all sub-routes
// const authRoutes = require('./auth.routes')
// const registrationRoutes = require('./registration.routes')
// const sessionRoutes = require('./session.routes')
// const scheduleRoutes = require('./schedule.routes')
// const studentRoutes = require('./student.routes')
// const tutorRoutes = require('./tutor.routes')
// const notificationRoutes = require('./notification.routes')
// const recordRoutes = require('./record.routes')
// const evaluationRoutes = require('./feedback-rating.routes')

// ============================================================
// ROUTER SETUP
// ============================================================
// PURPOSE: Tập hợp tất cả routes
// 
// PSEUDOCODE:
// const router = express.Router()
// 
// Step 1: Mount sub-routes
// router.use('/auth', authRoutes)
// router.use('/registrations', registrationRoutes)
// router.use('/sessions', sessionRoutes)
// router.use('/schedules', scheduleRoutes)
// router.use('/students', studentRoutes)
// router.use('/tutors', tutorRoutes)
// router.use('/notifications', notificationRoutes)
// router.use('/record', recordRoutes)
// router.use('/feedbacks', evaluationRoutes)

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================
// PURPOSE: Health check endpoint for monitoring
// 
// PSEUDOCODE:
// router.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV
//   })
// })

// ============================================================
// 404 HANDLER
// ============================================================
// PURPOSE: Handle undefined routes
// 
// PSEUDOCODE:
// router.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//     statusCode: 404
//   })
// })

// ============================================================
// ERROR HANDLER
// ============================================================
// PURPOSE: Global error handling middleware
// NOTE: This should be defined in server.js/app.js, not here
// 
// PSEUDOCODE (for reference):
// router.use((err, req, res, next) => {
//   console.error(err.stack)
//   
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     statusCode: err.statusCode || 500,
//     errors: err.errors || null
//   })
// })

import express from 'express';
const router = express.Router();

// Import all sub-routes
import authRoutes from './auth.routes.js';
import registrationRoutes from './registration.routes.js';
import studentRoutes from './student.routes.js';
import tutorRoutes from './tutor.routes.js';
import sessionRoutes from './session.routes.js';
import scheduleRoutes from './schedule.routes.js';
import notificationRoutes from './notification.routes.js';
import recordRoutes from './record.routes.js';
import evaluationRoutes from './feedback-rating.routes.js';

// Mount sub-routes
router.use('/auth', authRoutes);
router.use('/registrations', registrationRoutes);
router.use('/students', studentRoutes);
router.use('/tutors', tutorRoutes);
router.use('/sessions', sessionRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/notifications', notificationRoutes);
router.use('/records', recordRoutes);
router.use('/evaluations', evaluationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for API routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  });
});

export default router;
