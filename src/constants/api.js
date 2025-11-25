/**
 * FILE: api.js
 * MỤC ĐÍCH: Define API constants (pagination, response formats, rate limits)
 */

// ============================================================
// 1. API RESPONSE STRUCTURE
// ============================================================
// SUCCESS_RESPONSE = {
//   success: true,
//   data: {...},
//   message: 'Operation successful'
// }

// ERROR_RESPONSE = {
//   success: false,
//   error: {
//     code: 'ERROR_CODE',
//     message: 'Error message',
//     details: {...}  // Optional
//   }
// }

// ============================================================
// 2. PAGINATION DEFAULTS
// ============================================================
// DEFAULT_PAGE = 1
// DEFAULT_LIMIT = 20
// MAX_LIMIT = 100  // Prevent excessive data fetch

// PAGINATION_RESPONSE = {
//   success: true,
//   data: [...],
//   pagination: {
//     currentPage: 1,
//     totalPages: 5,
//     totalItems: 100,
//     itemsPerPage: 20,
//     hasNextPage: true,
//     hasPrevPage: false
//   }
// }

// ============================================================
// 3. RATE LIMITING
// ============================================================
// RATE_LIMIT_WINDOW = 15 * 60 * 1000  // 15 minutes in ms
// RATE_LIMIT_MAX_REQUESTS = 100       // Max 100 requests per window

// AUTH_RATE_LIMIT_WINDOW = 15 * 60 * 1000
// AUTH_RATE_LIMIT_MAX_REQUESTS = 5     // Max 5 login attempts per 15 min

// ============================================================
// 4. API VERSIONS
// ============================================================
// API_VERSION = 'v1'
// BASE_PATH = '/api/v1'

// ============================================================
// 5. HTTP STATUS CODES (từ constants/errors.js)
// ============================================================
// 200: OK
// 201: CREATED
// 204: NO_CONTENT
// 400: BAD_REQUEST (ValidationError)
// 401: UNAUTHORIZED (AuthenticationError)
// 403: FORBIDDEN (ForbiddenError)
// 404: NOT_FOUND (NotFoundError)
// 409: CONFLICT (ConflictError)
// 429: TOO_MANY_REQUESTS (Rate limiting)
// 500: INTERNAL_SERVER_ERROR (InternalServerError)

// TODO: Export all constants
