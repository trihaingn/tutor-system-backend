/**
 * DATABASE: MongoDB Connection
 * FILE: connection.js
 * MỤC ĐÍCH: Quản lý kết nối MongoDB với Singleton Pattern
 * 
 * DESIGN PATTERN: Singleton
 * - Chỉ tạo 1 connection duy nhất trong suốt runtime
 * - Tái sử dụng connection across application
 */

// TODO: Import mongoose, databaseConfig
// const mongoose = require('mongoose')
// const { databaseConfig } = require('../config/database.config')

// ============================================================
// SINGLETON CONNECTION
// ============================================================
// PURPOSE: Tạo và quản lý 1 MongoDB connection duy nhất
// 
// PSEUDOCODE:
// let connection = null
// 
// const connectDB = async () => {
//   Step 1: Check if connection already exists
//   if (connection) {
//     console.log('[DATABASE] Using existing connection')
//     return connection
//   }
//   
//   Step 2: Create new connection
//   try {
//     console.log('[DATABASE] Connecting to MongoDB...')
//     
//     connection = await mongoose.connect(databaseConfig.uri, databaseConfig.options)
//     
//     console.log(`[DATABASE] Connected to MongoDB: ${connection.connection.host}`)
//     
//     Step 3: Register event listeners
//     mongoose.connection.on('connected', () => {
//       console.log('[DATABASE] Mongoose connected')
//     })
//     
//     mongoose.connection.on('error', (err) => {
//       console.error('[DATABASE] Mongoose connection error:', err)
//     })
//     
//     mongoose.connection.on('disconnected', () => {
//       console.log('[DATABASE] Mongoose disconnected')
//     })
//     
//     Step 4: Handle process termination
//     process.on('SIGINT', async () => {
//       await mongoose.connection.close()
//       console.log('[DATABASE] Connection closed due to app termination')
//       process.exit(0)
//     })
//     
//     return connection
//     
//   } catch (error) {
//     console.error('[DATABASE] Failed to connect to MongoDB:', error)
//     process.exit(1) // Exit if cannot connect
//   }
// }

// ============================================================
// DISCONNECT DATABASE
// ============================================================
// PURPOSE: Đóng kết nối database (cleanup)
// 
// PSEUDOCODE:
// const disconnectDB = async () => {
//   if (!connection) {
//     return
//   }
//   
//   try {
//     await mongoose.connection.close()
//     connection = null
//     console.log('[DATABASE] Disconnected from MongoDB')
//   } catch (error) {
//     console.error('[DATABASE] Error disconnecting:', error)
//   }
// }

// ============================================================
// GET CONNECTION STATUS
// ============================================================
// PURPOSE: Kiểm tra trạng thái kết nối
// 
// PSEUDOCODE:
// const getConnectionStatus = () => {
//   if (!connection) {
//     return 'DISCONNECTED'
//   }
//   
//   const states = {
//     0: 'DISCONNECTED',
//     1: 'CONNECTED',
//     2: 'CONNECTING',
//     3: 'DISCONNECTING'
//   }
//   
//   return states[mongoose.connection.readyState] || 'UNKNOWN'
// }

// ============================================================
// HEALTH CHECK
// ============================================================
// PURPOSE: Kiểm tra database có sẵn sàng không
// USE CASE: Health check endpoint
// 
// PSEUDOCODE:
// const healthCheck = async () => {
//   try {
//     if (!connection) {
//       return {
//         status: 'DOWN',
//         message: 'No connection established'
//       }
//     }
//     
//     // Ping database
//     await mongoose.connection.db.admin().ping()
//     
//     return {
//       status: 'UP',
//       message: 'Database is healthy',
//       host: mongoose.connection.host,
//       database: mongoose.connection.name
//     }
//   } catch (error) {
//     return {
//       status: 'DOWN',
//       message: error.message
//     }
//   }
// }

// ============================================================
// CONNECTION RETRY LOGIC
// ============================================================
// PURPOSE: Tự động retry khi mất kết nối
// 
// PSEUDOCODE:
// const connectWithRetry = async (maxRetries = 5, delay = 5000) => {
//   let retries = 0
//   
//   while (retries < maxRetries) {
//     try {
//       await connectDB()
//       return
//     } catch (error) {
//       retries++
//       console.error(`[DATABASE] Connection attempt ${retries} failed`)
//       
//       if (retries < maxRetries) {
//         console.log(`[DATABASE] Retrying in ${delay/1000} seconds...`)
//         await new Promise(resolve => setTimeout(resolve, delay))
//       } else {
//         console.error('[DATABASE] Max retries reached, giving up')
//         throw error
//       }
//     }
//   }
// }

// ============================================================
// USAGE IN SERVER
// ============================================================
// In server.js or app.js:
// 
// const { connectDB } = require('./database/connection')
// 
// const startServer = async () => {
//   // Connect to database first
//   await connectDB()
//   
//   // Then start Express server
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//   })
// }
// 
// startServer()

import mongoose from 'mongoose';
import databaseConfig from '../config/database.config.js';

let connection = null;

/**
 * Connect to MongoDB with singleton pattern
 */
const connectDB = async () => {
  // Check if connection already exists
  if (connection) {
    console.log('[DATABASE] Using existing connection');
    return connection;
  }

  try {
    console.log('[DATABASE] Connecting to MongoDB...');
    
    connection = await mongoose.connect(databaseConfig.uri, databaseConfig.options);
    
    console.log(`[DATABASE] Connected to MongoDB: ${connection.connection.host}`);
    
    // Register event listeners
    mongoose.connection.on('connected', () => {
      console.log('[DATABASE] Mongoose connected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('[DATABASE] Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('[DATABASE] Mongoose disconnected');
    });
    
    return connection;
    
  } catch (error) {
    console.error('[DATABASE] Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  if (!connection) {
    return;
  }

  try {
    await mongoose.connection.close();
    connection = null;
    console.log('[DATABASE] Disconnected from MongoDB');
  } catch (error) {
    console.error('[DATABASE] Error disconnecting:', error);
    throw error;
  }
};

/**
 * Get connection status
 */
const getConnectionStatus = () => {
  if (!connection) {
    return 'DISCONNECTED';
  }

  const states = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING'
  };

  return states[mongoose.connection.readyState] || 'UNKNOWN';
};

/**
 * Health check for database
 */
const healthCheck = async () => {
  try {
    if (!connection) {
      return {
        status: 'DOWN',
        message: 'No connection established'
      };
    }

    // Ping database
    await mongoose.connection.db.admin().ping();

    return {
      status: 'UP',
      message: 'Database is healthy',
      host: mongoose.connection.host,
      database: mongoose.connection.name
    };
  } catch (error) {
    return {
      status: 'DOWN',
      message: error.message
    };
  }
};

export {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  healthCheck
};
