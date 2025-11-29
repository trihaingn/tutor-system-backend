// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// Verified with: /datacore/src/controllers/userController.js
// Response format: { success, data: {...} }

import axios from 'axios';
import datacoreConfig from '../../config/datacore.config.js';
import { InternalServerError, NotFoundError } from '../../utils/error.js';

/**
 * DatacoreService - Integration with HCMUT DATACORE
 * Business Rules:
 * - BR-007: Auto-sync DATACORE on every login
 * - DATACORE is READ-ONLY source of truth
 */
class DatacoreService {
  /**
   * Get user profile from DATACORE by ID (MSSV or Mã CB)
   * @throws {InternalServerError} If DATACORE service fails
   * @throws {NotFoundError} If user not found (404)
   */
  static async getUserInfo(userId) {
    const url = `${datacoreConfig.apiUrl}/users/profile/${userId}`;
    const response = await axios.get(url, {
      timeout: datacoreConfig.timeout || 5000
    });

    // Parse nested response: response.data.data
    if (!response.data || !response.data.success) {
      throw new NotFoundError(`User ${userId} not found in DATACORE`);
    }

    return response.data.data;
  }

  /**
   * Get student data from DATACORE by MSSV
   */
  static async getStudentData(mssv) {
    const userData = await this.getUserInfo(mssv);

    // Verify user is a student
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

    throw new NotFoundError(`User ${mssv} is not a student`);
  }

  /**
   * Get tutor/staff data from DATACORE by Mã CB
   */
  static async getTutorData(maCB) {
    const userData = await this.getUserInfo(maCB);

    // Verify user is staff/lecturer (not student)
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

    throw new NotFoundError(`User ${maCB} is not a staff member`);
  }

  /**
   * Sync user data from DATACORE
   */
  static async syncUser(userId) {
    const userData = await this.getUserInfo(userId);

    // Determine if student or staff
    if (userData.role === 'STUDENT' || userData.student_id) {
      return await this.getStudentData(userData.student_id || userId);
    } else if (userData.staff_id || userData.role !== 'STUDENT') {
      return await this.getTutorData(userData.staff_id || userId);
    }

    return userData;
  }

  /**
   * Sync all users from DATACORE
   * @throws {InternalServerError} If sync fails
   */
  static async syncAllUsers() {
    const url = `${datacoreConfig.apiUrl}/users/sync`;
    const response = await axios.get(url, {
      timeout: (datacoreConfig.timeout || 5000) * 2
    });

    if (!response.data || !response.data.success) {
      throw new InternalServerError('DATACORE sync failed');
    }

    return response.data.data || [];
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
}

export default DatacoreService;
