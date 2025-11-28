/**
 * SERVICE: SSOService
 * FILE: SSOService.js
 * MỤC ĐÍCH: Validate SSO tickets với HCMUT SSO portal (UC-01)
 * 
 * DEPENDENCIES:
 * - axios
 * - SSOConfig (SSO URLs, service URL)
 */

// ============================================================
// FUNCTION: getLoginUrl()
// ============================================================
// PURPOSE: Generate SSO login URL
// 
// PSEUDOCODE:
// Step 1: Build login URL
//   - const loginUrl = `${SSO_BASE_URL}/login?service=${encodeURIComponent(SERVICE_URL)}`
//   
//   - SERVICE_URL: URL của backend callback endpoint
//     Example: "https://tutor-app.com/api/v1/auth/callback"
// 
// OUTPUT:
// - Return SSO login URL string

// ============================================================
// FUNCTION: validateTicket(ticket)
// ============================================================
// PURPOSE: Validate SSO ticket và lấy user info
// 
// INPUT:
// - ticket: String (SSO ticket from callback, e.g., "ST-xxxxx")
// 
// PSEUDOCODE:
// Step 1: Build validation URL
//   - const validateUrl = `${SSO_BASE_URL}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(SERVICE_URL)}`
// 
// Step 2: Call SSO validation endpoint
//   - try {
//       const response = await axios.get(validateUrl, { timeout: 10000 })
//       const xmlData = response.data
//     }
//   - catch (error):
//     → Throw AuthenticationError("Cannot connect to SSO service")
// 
// Step 3: Parse XML response
//   - // SSO trả về XML format, cần parse:
//   - // <cas:serviceResponse>
//   - //   <cas:authenticationSuccess>
//   - //     <cas:user>email@hcmut.edu.vn</cas:user>
//   - //     <cas:attributes>
//   - //       <cas:mssv>2210001</cas:mssv>
//   - //       <cas:fullName>Nguyen Van A</cas:fullName>
//   - //       <cas:faculty>Computer Science</cas:faculty>
//   - //     </cas:attributes>
//   - //   </cas:authenticationSuccess>
//   - // </cas:serviceResponse>
//   
//   - const parser = new xml2js.Parser()
//   - const result = await parser.parseStringPromise(xmlData)
// 
// Step 4: Extract user info
//   - If result contains <cas:authenticationFailure>:
//     → Throw AuthenticationError("Invalid SSO ticket")
//   
//   - const attributes = result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:attributes'][0]
//   - const userInfo = {
//       email: attributes['cas:user'][0],
//       mssv: attributes['cas:mssv']?.[0] || null,
//       maCB: attributes['cas:maCB']?.[0] || null,
//       fullName: attributes['cas:fullName'][0],
//       faculty: attributes['cas:faculty'][0]
//     }
// 
// OUTPUT:
// - Return userInfo object

// ============================================================
// FUNCTION: getLogoutUrl()
// ============================================================
// PURPOSE: Generate SSO logout URL
// 
// PSEUDOCODE:
// - return `${SSO_BASE_URL}/logout`

import axios from 'axios';
import ssoConfig from '../../config/sso.config.js';
import { AuthenticationError, InternalServerError } from '../../middleware/errorMiddleware.js';

/**
 * SSOService - CAS SSO Integration
 * Integrates with real CAS server
 */

class SSOService {
  /**
   * Generate SSO login URL
   * @returns {string} SSO login URL
   */
  static getLoginUrl() {
    if (!ssoConfig.enabled) {
      // Mock mode: return mock URL
      return `${ssoConfig.baseUrl}/login?service=${encodeURIComponent(ssoConfig.serviceUrl)}`;
    }
    
    // Real CAS login URL
    return `${ssoConfig.loginUrl}?service=${encodeURIComponent(ssoConfig.serviceUrl)}`;
  }

  /**
   * Validate SSO ticket with CAS server
   * @param {string} ticket - SSO ticket from callback
   * @param {string} service - Service URL
   * @returns {Promise<Object>} User info from SSO
   */
  static async validateTicket(ticket, service) {
    if (!ssoConfig.enabled) {
      // Mock mode: return mock user data based on ticket
      console.log('[SSO] Mock mode enabled, returning mock data');
      return this._mockValidateTicket(ticket);
    }

    try {
      console.log('[SSO] Validating ticket with CAS server:', ssoConfig.validateUrl);
      
      // Call CAS validation endpoint
      const response = await axios.get(ssoConfig.validateUrl, {
        params: { ticket, service },
        timeout: 10000
      });

      if (!response.data || !response.data.success) {
        throw new AuthenticationError('Invalid SSO ticket');
      }

      // Extract user info from CAS response
      const userData = response.data.user;
      
      return {
        success: true,
        email: userData.email,
        mssv: userData.mssv || null,
        maCB: userData.maCB || null,
        fullName: userData.fullName || userData.name,
        faculty: userData.faculty || userData.department,
        role: userData.role || 'STUDENT'
      };

    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      console.error('[SSO] Validation error:', error.message);
      throw new InternalServerError(`SSO validation failed: ${error.message}`);
    }
  }

  /**
   * Generate SSO logout URL
   * @returns {string} SSO logout URL
   */
  static getLogoutUrl() {
    if (!ssoConfig.enabled) {
      return `${ssoConfig.baseUrl}/logout`;
    }
    return `${ssoConfig.logoutUrl}`;
  }

  /**
   * Check SSO service health
   */
  static async validateConnection() {
    try {
      if (!ssoConfig.enabled) {
        return { status: 'OK', message: 'SSO disabled (mock mode)' };
      }

      const healthUrl = `${ssoConfig.baseUrl}/health`;
      const response = await axios.get(healthUrl, { timeout: 3000 });

      return {
        status: 'OK',
        message: 'SSO service is reachable',
        data: response.data
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'SSO service unavailable',
        error: error.message
      };
    }
  }

  /**
   * MOCK: Validate ticket (for development)
   * @private
   * @param {string} ticket - Mock ticket
   * @returns {Object} Mock user data
   */
  static _mockValidateTicket(ticket) {
    // Mock ticket validation
    if (!ticket || !ticket.startsWith('ST-')) {
      throw new AuthenticationError('Invalid ticket format');
    }

    // Parse ticket to determine user type
    if (ticket.includes('student')) {
      return {
        success: true,
        email: 'student@hcmut.edu.vn',
        mssv: '2210001',
        maCB: null,
        fullName: 'Nguyen Van A',
        faculty: 'Computer Science',
        role: 'STUDENT'
      };
    } else if (ticket.includes('tutor') || ticket.includes('lecturer')) {
      return {
        success: true,
        email: 'tutor@hcmut.edu.vn',
        mssv: null,
        maCB: 'CB001',
        fullName: 'Prof. Tran Van B',
        faculty: 'Computer Science',
        role: 'TUTOR'
      };
    } else {
      // Default student
      return {
        success: true,
        email: 'user@hcmut.edu.vn',
        mssv: '2210099',
        maCB: null,
        fullName: 'Test User',
        faculty: 'General',
        role: 'STUDENT'
      };
    }
  }
}

export default SSOService;
