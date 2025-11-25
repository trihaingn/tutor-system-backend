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

// TODO: Import axios
// TODO: Import LibraryConfig

// TODO: Implement searchBooks(query) - if needed in future
// TODO: Implement getBookDetails(bookId) - if needed in future

// TODO: Export all functions
