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

import dotenv from 'dotenv';
dotenv.config();

export default {
  apiUrl: process.env.LIBRARY_API_URL || 'http://localhost:3002/api',
  timeout: parseInt(process.env.LIBRARY_TIMEOUT) || 5000,
  
  endpoints: {
    searchResources: '/resources/search',
    getResource: '/resources/:id',
    getAllResources: '/resources',
    getSubjects: '/subjects',
    getTypes: '/types',
    getPopular: '/resources/popular'
  }
};
