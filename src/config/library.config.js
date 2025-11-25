/**
 * CONFIG: Library Configuration
 * FILE: library.config.js
 * MỤC ĐÍCH: Cấu hình kết nối đến hệ thống thư viện HCMUT
 * 
 * ENVIRONMENT VARIABLES:
 * - LIBRARY_API_URL: Base URL của Library API
 * - LIBRARY_API_KEY: API key
 * 
 * NOTE: Feature này là OPTIONAL/FUTURE - chưa implement trong version 1.0
 */

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// LIBRARY CONFIGURATION
// ============================================================
// PURPOSE: Export library API settings
// 
// PSEUDOCODE:
// const libraryConfig = {
//   // API Base URL
//   apiUrl: process.env.LIBRARY_API_URL || 'https://library.hcmut.edu.vn/api',
//   
//   // API Authentication
//   apiKey: process.env.LIBRARY_API_KEY || '',
//   
//   // Request Timeout
//   timeout: 5000,
//   
//   // API Endpoints
//   endpoints: {
//     // Tìm kiếm sách
//     searchBooks: '/books/search',
//     
//     // Chi tiết sách
//     getBookDetails: '/books/:id',
//     
//     // Sách đề xuất
//     recommendedBooks: '/books/recommended'
//   },
//   
//   // Feature Flag
//   enabled: process.env.ENABLE_LIBRARY === 'true' || false
// }

// ============================================================
// PLACEHOLDER IMPLEMENTATION
// ============================================================
// NOTE: Không implement trong version 1.0, chỉ là placeholder
// 
// PSEUDOCODE:
// const searchBooks = async (query) => {
//   if (!libraryConfig.enabled) {
//     return {
//       message: 'Library integration not enabled',
//       books: []
//     }
//   }
//   
//   // TODO: Implement axios call to library API
//   throw new Error('Library integration not implemented yet')
// }

// TODO: Export configuration
// module.exports = {
//   libraryConfig,
//   searchBooks
// }
