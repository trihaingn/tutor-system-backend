const axios = require('axios');
const datacoreConfig = require('../../config/datacore.config');

/**
 * DatacoreService - Integration with HCMUT DATACORE
 * 
 * Business Rules:
 * - BR-007: Auto-sync DATACORE on every login
 * - DATACORE is READ-ONLY source of truth
 */

class DatacoreService {
  /**
   * Get user profile from DATACORE by ID (MSSV or Mã CB)
   */
  static async getUserInfo(userId) {
    try {
      const url = `${datacoreConfig.apiUrl}/users/profile/${userId}`;
      const response = await axios.get(url, {
        timeout: datacoreConfig.timeout || 5000
      });

      if (!response.data || !response.data.success) {
        console.warn('[DATACORE] User not found:', userId);
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error('[DATACORE] Get user info error:', error.message);
      if (error.response && error.response.status === 404) {
        return null;
      }
      return null;
    }
  }

  /**
   * Get student data from DATACORE by MSSV
   */
  static async getStudentData(mssv) {
    try {
      const userData = await this.getUserInfo(mssv);
      
      if (!userData) {
        return null;
      }

      // Check if user is a student
      if (userData.role === 'STUDENT' || userData.student_id) {
        return {
          mssv: userData.student_id || mssv,
          fullName: userData.full_name || userData.name,
          email: userData.email,
          faculty: userData.faculty || userData.department,
          major: userData.major || userData.faculty,
          enrollmentYear: userData.enrollment_year || new Date().getFullYear(),
          currentYear: userData.current_year || 1,
          gpa: parseFloat(userData.gpa) || 0,
          totalCredits: parseInt(userData.total_credits) || 0,
          role: 'STUDENT'
        };
      }

      return null;
    } catch (error) {
      console.error('[DATACORE] Get student data error:', error.message);
      return null;
    }
  }

  /**
   * Get tutor/staff data from DATACORE by Mã CB
   */
  static async getTutorData(maCB) {
    try {
      const userData = await this.getUserInfo(maCB);
      
      if (!userData) {
        return null;
      }

      // Check if user is staff/lecturer (not student)
      if (userData.role !== 'STUDENT' && (userData.staff_id || userData.role)) {
        return {
          maCB: userData.staff_id || maCB,
          fullName: userData.full_name || userData.name,
          email: userData.email,
          faculty: userData.faculty || userData.department,
          role: userData.role || 'TUTOR',
          expertise: userData.expertise || [],
          bio: userData.bio || '',
          position: userData.position || 'Lecturer'
        };
      }

      return null;
    } catch (error) {
      console.error('[DATACORE] Get tutor data error:', error.message);
      return null;
    }
  }

  /**
   * Sync user data from DATACORE
   */
  static async syncUser(userId) {
    try {
      const userData = await this.getUserInfo(userId);
      
      if (!userData) {
        console.warn('[DATACORE] User not found for sync:', userId);
        return null;
      }

      // Determine if student or staff
      if (userData.role === 'STUDENT' || userData.student_id) {
        return await this.getStudentData(userData.student_id || userId);
      } else if (userData.staff_id || userData.role !== 'STUDENT') {
        return await this.getTutorData(userData.staff_id || userId);
      }

      return userData;
    } catch (error) {
      console.error('[DATACORE] Sync user error:', error.message);
      return null;
    }
  }

  /**
   * Sync all users from DATACORE
   */
  static async syncAllUsers() {
    try {
      const url = `${datacoreConfig.apiUrl}/users/sync`;
      const response = await axios.get(url, {
        timeout: (datacoreConfig.timeout || 5000) * 2
      });

      if (!response.data || !response.data.success) {
        return [];
      }

      return response.data.data || [];
    } catch (error) {
      console.error('[DATACORE] Sync all users error:', error.message);
      return [];
    }
  }

  /**
   * Map DATACORE role to system role
   */
  static mapRole(datacoreRole) {
    const roleMapping = {
      'STUDENT': 'STUDENT',
      'LECTURER': 'TUTOR',
      'RESEARCH_STUDENT': 'TUTOR',
      'SENIOR_STUDENT': 'TUTOR',
      'STAFF': 'TUTOR',
      'ADMIN': 'ADMIN'
    };
    return roleMapping[datacoreRole?.toUpperCase()] || 'STUDENT';
  }

  /**
   * Map DATACORE role to tutor type
   */
  static mapTutorType(datacoreRole) {
    const typeMapping = {
      'LECTURER': 'LECTURER',
      'RESEARCH_STUDENT': 'RESEARCH_STUDENT',
      'SENIOR_STUDENT': 'SENIOR_STUDENT',
      'STAFF': 'LECTURER'
    };
    return typeMapping[datacoreRole?.toUpperCase()] || 'LECTURER';
  }

  /**
   * Validate DATACORE connection (health check)
   */
  static async validateConnection() {
    try {
      const healthUrl = `${datacoreConfig.apiUrl}/health`;
      const response = await axios.get(healthUrl, { timeout: 3000 });
      
      return {
        status: 'OK',
        message: 'DATACORE service is reachable',
        data: response.data
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'DATACORE service unavailable',
        error: error.message
      };
    }
  }
}

module.exports = DatacoreService;
