/**
 * SERVICE: CASService
 * FILE: CASService.js
 * PURPOSE: Handle CAS (Central Authentication Service) ticket validation
 * 
 * RESPONSIBILITIES:
 * - Validate CAS tickets with the CAS server
 * - Extract user information from CAS validation response
 * - Handle CAS protocol (single-use tickets, service URLs)
 * 
 * SECURITY:
 * - Never trust client-provided user info
 * - Only trust CAS validation results
 * - Tickets are single-use only
 * - Always validate tickets server-to-server
 */

import axios from 'axios';
import logger from '../../utils/logger.js';
import casConfig from '../../config/cas.config.js';

class CASService {
  /**
   * Generate CAS login URL
   * Redirects user to CAS login page with service callback URL
   * 
   * @param {string} serviceUrl - The callback URL (where CAS redirects after login)
   * @returns {string} - Full CAS login URL
   * 
   * Example:
   * Input: serviceUrl = "http://localhost:3000/api/v1/auth/cas/callback"
   * Output: "http://localhost:5000/auth/login?service=http://localhost:3000/api/v1/auth/cas/callback"
   */
  generateLoginUrl(serviceUrl) {
    const loginUrl = new URL('/auth/login', casConfig.baseUrl);
    loginUrl.searchParams.set('service', serviceUrl || casConfig.serviceUrl);
    
    logger.info(`Generated CAS login URL: ${loginUrl.toString()}`);
    return loginUrl.toString();
  }

  /**
   * Validate CAS ticket with CAS server
   * Server-to-server ticket validation (POST /auth/validate)
   * 
   * @param {string} ticket - The CAS service ticket (ST-xxxxx)
   * @param {string} serviceUrl - The service URL used during login
   * @returns {Promise<Object>} - User information if valid
   * @throws {Error} - If ticket is invalid or validation fails
   * 
   * FLOW:
   * 1. Send POST request to CAS /auth/validate endpoint
   * 2. Include ticket and service URL in request body
   * 3. CAS validates ticket (single-use, expiry check)
   * 4. CAS returns user info if valid
   * 5. Return user data to caller
   * 
   * SECURITY NOTES:
   * - Ticket is single-use (CAS invalidates after validation)
   * - Always use HTTPS in production
   * - Validate service URL matches original request
   * 
   * Example Response from CAS:
   * {
   *   success: true,
   *   user: {
   *     id: "507f1f77bcf86cd799439011",
   *     username: "student01",
   *     email: "student01@hcmut.edu.vn"
   *   }
   * }
   */
  async validateTicket(ticket, serviceUrl) {
    try {
      logger.info(`Validating CAS ticket: ${ticket.substring(0, 10)}...`);

      // Validate inputs
      if (!ticket) {
        throw new Error('CAS ticket is required');
      }

      if (!serviceUrl && !casConfig.serviceUrl) {
        throw new Error('Service URL is required for ticket validation');
      }

      const validateUrl = `${casConfig.baseUrl}/auth/validate`;
      const payload = {
        ticket,
        service: serviceUrl || casConfig.serviceUrl
      };

      logger.debug(`Calling CAS validate endpoint: ${validateUrl}`);
      logger.debug(`Payload: ${JSON.stringify(payload)}`);

      // Call CAS server to validate ticket
      const response = await axios.post(validateUrl, payload, {
        timeout: casConfig.timeout || 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      logger.debug(`CAS validation response: ${JSON.stringify(response.data)}`);

      // Check if validation was successful
      if (!response.data.success) {
        logger.warn(`CAS ticket validation failed: ${ticket.substring(0, 10)}...`);
        throw new Error('Invalid or expired CAS ticket');
      }

      // Extract user info from CAS response
      const userData = response.data.user;
      
      if (!userData || !userData.id || !userData.email) {
        logger.error('CAS returned incomplete user data');
        throw new Error('Invalid user data from CAS');
      }

      logger.info(`CAS ticket validated successfully for user: ${userData.email}`);

      return {
        id: userData.id,
        username: userData.username,
        email: userData.email
      };

    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // CAS server responded with error
        logger.error(`CAS validation error response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        throw new Error(`CAS validation failed: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // CAS server did not respond
        logger.error(`CAS server not reachable: ${casConfig.baseUrl}`);
        throw new Error('CAS server is not available. Please try again later.');
      } else {
        // Other errors (validation, configuration, etc.)
        logger.error(`CAS validation error: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Generate CAS logout URL
   * Redirects user to CAS logout page
   * 
   * @param {string} returnUrl - Optional URL to redirect after logout
   * @returns {string} - Full CAS logout URL
   */
  generateLogoutUrl(returnUrl) {
    const logoutUrl = new URL('/auth/logout', casConfig.baseUrl);
    
    if (returnUrl) {
      logoutUrl.searchParams.set('service', returnUrl);
    }
    
    logger.info(`Generated CAS logout URL: ${logoutUrl.toString()}`);
    return logoutUrl.toString();
  }

  /**
   * Check if CAS is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return casConfig.enabled === true;
  }
}

export default new CASService();
