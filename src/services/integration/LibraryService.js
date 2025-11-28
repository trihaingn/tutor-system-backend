/**
 * SERVICE: LibraryService
 * FILE: LibraryService.js
 * MỤC ĐÍCH: Tích hợp với hệ thống Thư viện (optional feature)
 * 
 * NOTE: Service này có thể không được implement trong version 1.0
 * Dành cho tương lai khi cần tích hợp với Library system
 * 
 * DEPENDENCIES:
 * - axios
 * - LibraryConfig (API endpoints)
 */

// ============================================================
// FUNCTION: searchBooks(query)
// ============================================================
// PURPOSE: Tìm kiếm sách trong thư viện
// 
// INPUT:
// - query: String (search keywords)
// 
// PSEUDOCODE:
// Step 1: Call Library API
//   - const url = `${LIBRARY_API_URL}/books/search?q=${encodeURIComponent(query)}`
//   - const response = await axios.get(url)
// 
// Step 2: Transform results
//   - return response.data.books.map(book => ({
//       bookId: book.id,
//       title: book.title,
//       author: book.author,
//       isbn: book.isbn,
//       availability: book.available_copies > 0
//     }))
// 
// OUTPUT:
// - Return array of book objects

// ============================================================
// FUNCTION: getBookDetails(bookId)
// ============================================================
// PURPOSE: Lấy chi tiết sách
// 
// PSEUDOCODE:
// Step 1: Call Library API
//   - const url = `${LIBRARY_API_URL}/books/${bookId}`
//   - const response = await axios.get(url)
// 
// OUTPUT:
// - Return book details

const axios = require('axios');
const libraryConfig = require('../../config/library.config');

/**
 * LibraryService - Integration with HCMUT LIBRARY
 */

class LibraryService {
  /**
   * Search library resources
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} Search results with pagination
   */
  static async searchResources(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const url = `${libraryConfig.apiUrl}/resources/search?${queryParams.toString()}`;
      
      const response = await axios.get(url, {
        timeout: libraryConfig.timeout || 5000
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to search library: ${error.message}`);
    }
  }

  /**
   * Get resource details by ID
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Object>} Resource details
   */
  static async getResourceDetails(resourceId) {
    try {
      const url = `${libraryConfig.apiUrl}/resources/${resourceId}`;
      const response = await axios.get(url, {
        timeout: libraryConfig.timeout || 5000
      });

      if (!response.data || !response.data.success) {
        throw new Error('Resource not found');
      }

      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Resource ${resourceId} not found`);
      }
      throw new Error(`Failed to get resource details: ${error.message}`);
    }
  }

  /**
   * Get all resources
   * @returns {Promise<Array>} All resources
   */
  static async getAllResources() {
    try {
      const url = `${libraryConfig.apiUrl}/resources`;
      const response = await axios.get(url, {
        timeout: libraryConfig.timeout || 5000
      });

      return response.data.data || [];
    } catch (error) {
      throw new Error(`Failed to get resources: ${error.message}`);
    }
  }

  /**
   * Get available subjects
   * @returns {Promise<Array>} List of subjects
   */
  static async getSubjects() {
    try {
      const url = `${libraryConfig.apiUrl}/subjects`;
      const response = await axios.get(url);
      return response.data.data || [];
    } catch (error) {
      throw new Error(`Failed to get subjects: ${error.message}`);
    }
  }

  /**
   * Get resource types
   * @returns {Promise<Array>} List of resource types
   */
  static async getResourceTypes() {
    try {
      const url = `${libraryConfig.apiUrl}/types`;
      const response = await axios.get(url);
      return response.data.data || [];
    } catch (error) {
      throw new Error(`Failed to get resource types: ${error.message}`);
    }
  }
}

module.exports = LibraryService;
