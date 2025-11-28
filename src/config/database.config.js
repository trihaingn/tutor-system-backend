/**
 * CONFIG: Database Configuration
 * FILE: database.config.js
 * MỤC ĐÍCH: Cấu hình kết nối MongoDB
 * 
 * ENVIRONMENT VARIABLES:
 * - MONGO_URI: Connection string MongoDB
 * - DB_NAME: Tên database (optional, nếu không có trong URI)
 */

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// DATABASE CONFIGURATION
// ============================================================
// PURPOSE: Export MongoDB connection settings
// 
// PSEUDOCODE:
// const databaseConfig = {
//   // MongoDB Connection URI
//   uri: process.env.MONGO_URI || 'mongodb://localhost:27017/tutor_system',
//   
//   // Connection Options
//   options: {
//     // Use new URL parser
//     useNewUrlParser: true,
//     
//     // Use unified topology engine
//     useUnifiedTopology: true,
//     
//     // Auto-create indexes
//     autoIndex: true,
//     
//     // Connection pool size
//     maxPoolSize: 10,
//     
//     // Server selection timeout (30s)
//     serverSelectionTimeoutMS: 30000,
//     
//     // Socket timeout (45s)
//     socketTimeoutMS: 45000,
//     
//     // Retry writes on failure
//     retryWrites: true,
//     
//     // Write concern
//     w: 'majority'
//   }
// }

// ============================================================
// ENVIRONMENT-SPECIFIC CONFIGS
// ============================================================
// PURPOSE: Khác biệt giữa development/staging/production
// 
// PSEUDOCODE:
// if (process.env.NODE_ENV === 'development') {
//   databaseConfig.options.autoIndex = true // Enable auto-indexing
//   databaseConfig.options.debug = true    // Enable Mongoose debug mode
// }
// 
// if (process.env.NODE_ENV === 'production') {
//   databaseConfig.options.autoIndex = false // Disable auto-indexing for performance
//   databaseConfig.options.maxPoolSize = 50  // Increase pool size
// }

// ============================================================
// CONNECTION STRING FORMAT
// ============================================================
// EXAMPLES:
// 
// LOCAL:
// mongodb://localhost:27017/tutor_system
// 
// MONGO ATLAS (Cloud):
// mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tutor_system?retryWrites=true&w=majority
// 
// WITH AUTHENTICATION:
// mongodb://<username>:<password>@localhost:27017/tutor_system?authSource=admin

// ============================================================
// REPLICA SET (for production)
// ============================================================
// PURPOSE: High availability with replica sets
// 
// PSEUDOCODE:
// const replicaSetConfig = {
//   uri: 'mongodb://host1:27017,host2:27017,host3:27017/tutor_system',
//   options: {
//     replicaSet: 'rs0',
//     readPreference: 'primaryPreferred'
//   }
// }

// ============================================================
// IMPLEMENTATION
// ============================================================

require('dotenv').config();

const databaseConfig = {
  // MongoDB Connection URI
  uri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/tutor-system',
  
  // Connection Options
  options: {
    // Auto-create indexes (disable in production for performance)
    autoIndex: process.env.NODE_ENV !== 'production',
    
    // Connection pool size
    maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
    
    // Server selection timeout (30s)
    serverSelectionTimeoutMS: 30000,
    
    // Socket timeout (45s)
    socketTimeoutMS: 45000,
    
    // Retry writes on failure
    retryWrites: true,
    
    // Write concern
    w: 'majority'
  }
};

// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  // Mongoose will log all queries to console
  // Uncomment to enable: databaseConfig.options.debug = true;
}

module.exports = databaseConfig;
