/**
 * SERVICE: SSOService
 * PURPOSE: Validate SSO tickets with local CAS server
 * ARCHITECTURE: Integration layer - calls external CAS API
 * 
 * API VERIFIED: /cas/server/routes/auth.js
 * - POST /auth/validate { ticket, service }
 * - Response: { success: true, user: { id, username, email } }
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

// Verified with /cas/server/routes/auth.js - POST /auth/validate
import axios from 'axios';
import { AuthenticationError, InternalServerError } from '../../utils/error.js';

class SSOService {
  constructor() {
    this.casServerUrl = process.env.CAS_SERVER_URL || 'http://localhost:5000';
    this.serviceUrl = process.env.APP_URL || 'http://localhost:3000';
  }

  getLoginUrl() {
    const callbackUrl = `${this.serviceUrl}/api/v1/auth/callback`;
    return `${this.casServerUrl}/auth/login?service=${encodeURIComponent(callbackUrl)}`;
  }

  // Verified with /cas/server/routes/auth.js (line 61)
  // POST /auth/validate expects: { ticket, service }
  // Returns: { success: true, user: { id, username, email } }
  async validateTicket(ticket) {
    const callbackUrl = `${this.serviceUrl}/api/v1/auth/callback`;

    // Call CAS server POST /auth/validate
    const response = await axios.post(
      `${this.casServerUrl}/auth/validate`,
      { ticket, service: callbackUrl },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );

    const { success, user } = response.data;

    if (!success || !user) {
      throw new AuthenticationError('Invalid SSO ticket');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }

  getLogoutUrl() {
    return `${this.casServerUrl}/auth/logout`;
  }
}

export default new SSOService();
