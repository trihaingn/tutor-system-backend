// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// BR-007: Auto-sync DATACORE data periodically (cron job)
// Purpose: Background job to sync user data from DATACORE
// Architecture: Services import Repositories ONLY

import UserRepository from '../../repositories/UserRepository.js';
import StudentRepository from '../../repositories/StudentRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import DatacoreService from '../integration/DatacoreService.js';
import { 
  InternalServerError
} from '../../utils/error.js';

/**
 * Sync all users from DATACORE (BR-007)
 * Manual trigger or scheduled via cron job
 */
async function syncAll() {
  console.log('[DataSyncService] Starting sync all users from DATACORE...');
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  try {
    // Step 1: Find users that need sync (lastSyncAt > 24h or null)
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    const usersToSync = await UserRepository.findAll({
      $or: [
        { lastSyncAt: { $lt: cutoffTime } },
        { lastSyncAt: null }
      ],
      status: 'ACTIVE' // Only sync active users
    });

    console.log(`[DataSyncService] Found ${usersToSync.length} users to sync`);

    // Step 2: Sync each user
    for (const user of usersToSync) {
      try {
        // Step 2a: Sync Student data if MSSV exists
        if (user.mssv) {
          const studentData = await DatacoreService.getStudentData(user.mssv);
          
          if (studentData) {
            // Find or create Student profile
            let student = await StudentRepository.findOne({ userId: user._id });
            
            if (student) {
              // Update existing student
              await StudentRepository.update(student._id, {
                faculty: studentData.faculty || student.faculty,
                major: studentData.major || student.major,
                academicYear: studentData.academicYear || student.academicYear,
                gpa: studentData.gpa !== undefined ? studentData.gpa : student.gpa
              });
            } else {
              // Create new student profile
              await StudentRepository.create({
                userId: user._id,
                mssv: user.mssv,
                faculty: studentData.faculty || '',
                major: studentData.major || '',
                academicYear: studentData.academicYear || new Date().getFullYear(),
                gpa: studentData.gpa || 0
              });
            }
          }
        }

        // Step 2b: Sync Tutor data if maCB exists
        if (user.maCB) {
          const tutorData = await DatacoreService.getTutorData(user.maCB);
          
          if (tutorData) {
            // Find or create Tutor profile
            let tutor = await TutorRepository.findOne({ userId: user._id });
            
            if (tutor) {
              // Update existing tutor
              await TutorRepository.update(tutor._id, {
                department: tutorData.department || tutor.department,
                position: tutorData.position || tutor.position,
                specializations: tutorData.specializations || tutor.specializations,
                officeLocation: tutorData.officeLocation || tutor.officeLocation
              });
            } else {
              // Create new tutor profile
              await TutorRepository.create({
                userId: user._id,
                maCB: user.maCB,
                department: tutorData.department || '',
                position: tutorData.position || '',
                specializations: tutorData.specializations || [],
                officeLocation: tutorData.officeLocation || '',
                rating: 0,
                totalRatings: 0
              });
            }
          }
        }

        // Step 2c: Update user's lastSyncAt timestamp
        await UserRepository.update(user._id, {
          lastSyncAt: new Date()
        });

        results.success++;
        console.log(`[DataSyncService] ✓ Synced user ${user.email || user.mssv || user.maCB}`);

      } catch (error) {
        results.failed++;
        results.errors.push({
          userId: user._id,
          email: user.email,
          error: error.message
        });
        console.error(`[DataSyncService] ✗ Failed to sync user ${user._id}:`, error.message);
      }
    }

    // Step 3: Return summary
    console.log('[DataSyncService] Sync completed:', results);
    return results;

  } catch (error) {
    console.error('[DataSyncService] Critical error during sync:', error);
    throw new InternalServerError('Failed to sync users from DATACORE');
  }
}

/**
 * Sync specific user by ID
 */
async function syncUser(userId) {
  console.log(`[DataSyncService] Syncing user ${userId}...`);

  try {
    // Step 1: Find user
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User không tồn tại');
    }

    // Step 2: Sync Student data if MSSV exists
    if (user.mssv) {
      const studentData = await DatacoreService.getStudentData(user.mssv);
      
      if (studentData) {
        let student = await StudentRepository.findOne({ userId: user._id });
        
        if (student) {
          await StudentRepository.update(student._id, {
            faculty: studentData.faculty || student.faculty,
            major: studentData.major || student.major,
            academicYear: studentData.academicYear || student.academicYear,
            gpa: studentData.gpa !== undefined ? studentData.gpa : student.gpa
          });
        } else {
          await StudentRepository.create({
            userId: user._id,
            mssv: user.mssv,
            faculty: studentData.faculty || '',
            major: studentData.major || '',
            academicYear: studentData.academicYear || new Date().getFullYear(),
            gpa: studentData.gpa || 0
          });
        }
      }
    }

    // Step 3: Sync Tutor data if maCB exists
    if (user.maCB) {
      const tutorData = await DatacoreService.getTutorData(user.maCB);
      
      if (tutorData) {
        let tutor = await TutorRepository.findOne({ userId: user._id });
        
        if (tutor) {
          await TutorRepository.update(tutor._id, {
            department: tutorData.department || tutor.department,
            position: tutorData.position || tutor.position,
            specializations: tutorData.specializations || tutor.specializations,
            officeLocation: tutorData.officeLocation || tutor.officeLocation
          });
        } else {
          await TutorRepository.create({
            userId: user._id,
            maCB: user.maCB,
            department: tutorData.department || '',
            position: tutorData.position || '',
            specializations: tutorData.specializations || [],
            officeLocation: tutorData.officeLocation || '',
            rating: 0,
            totalRatings: 0
          });
        }
      }
    }

    // Step 4: Update lastSyncAt
    await UserRepository.update(user._id, {
      lastSyncAt: new Date()
    });

    console.log(`[DataSyncService] ✓ User ${userId} synced successfully`);
    return { success: true };

  } catch (error) {
    console.error(`[DataSyncService] ✗ Failed to sync user ${userId}:`, error.message);
    throw error;
  }
}

/**
 * Get sync statistics
 */
async function getSyncStats() {
  try {
    // Count users by sync status
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const allUsers = await UserRepository.findAll({ status: 'ACTIVE' });
    const recentlySynced = await UserRepository.findAll({
      lastSyncAt: { $gte: cutoffTime },
      status: 'ACTIVE'
    });
    const needsSync = await UserRepository.findAll({
      $or: [
        { lastSyncAt: { $lt: cutoffTime } },
        { lastSyncAt: null }
      ],
      status: 'ACTIVE'
    });

    return {
      totalUsers: allUsers.length,
      recentlySynced: recentlySynced.length,
      needsSync: needsSync.length,
      lastSyncCheck: new Date()
    };

  } catch (error) {
    console.error('[DataSyncService] Failed to get sync stats:', error);
    throw new InternalServerError('Failed to get sync statistics');
  }
}

export {
  syncAll,
  syncUser,
  getSyncStats
};
