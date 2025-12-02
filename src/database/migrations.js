/**
 * DATABASE MIGRATIONS
 * FILE: migrations.js
 * MỤC ĐÍCH: Tự động đồng bộ schema và xóa indexes cũ khi deploy
 * 
 * WORKFLOW:
 * 1. Xóa các indexes obsolete từ schema cũ
 * 2. Đồng bộ indexes mới từ Mongoose models
 * 3. Cleanup dữ liệu không hợp lệ (optional)
 */

import mongoose from 'mongoose';

/**
 * Drop obsolete indexes that no longer exist in current schema
 */
const dropObsoleteIndexes = async () => {
  console.log('[MIGRATION] Starting index cleanup...');
  
  try {
    const db = mongoose.connection.db;
    
    // ============================================================
    // TUTORS COLLECTION - Remove old indexes
    // ============================================================
    const tutorsCollection = db.collection('tutors');
    const tutorIndexes = await tutorsCollection.indexes();
    
    const obsoleteTutorIndexes = [
      'maCB_1',                           // Old field: staff ID
      'expertise.subjectId_1',            // Changed to: subjectIds array
      'type_1',                           // Field removed
      'type_1_stats.averageRating_-1'    // Field removed
    ];
    
    for (const indexName of obsoleteTutorIndexes) {
      const exists = tutorIndexes.some(idx => idx.name === indexName);
      if (exists) {
        await tutorsCollection.dropIndex(indexName);
        console.log(`[MIGRATION] ✓ Dropped obsolete tutor index: ${indexName}`);
      }
    }
    
    // ============================================================
    // STUDENTS COLLECTION - Remove old indexes
    // ============================================================
    const studentsCollection = db.collection('students');
    const studentIndexes = await studentsCollection.indexes();
    
    const obsoleteStudentIndexes = [
      'mssv_1'  // Changed to sparse index, need to recreate
    ];
    
    for (const indexName of obsoleteStudentIndexes) {
      const exists = studentIndexes.some(idx => idx.name === indexName);
      if (exists) {
        const index = studentIndexes.find(idx => idx.name === indexName);
        // Only drop if not already sparse
        if (index && !index.sparse) {
          await studentsCollection.dropIndex(indexName);
          console.log(`[MIGRATION] ✓ Dropped obsolete student index: ${indexName}`);
        }
      }
    }
    
    // ============================================================
    // SESSIONS COLLECTION - Update field indexes
    // ============================================================
    const sessionsCollection = db.collection('tutorsessions');
    const sessionIndexes = await sessionsCollection.indexes();
    
    const obsoleteSessionIndexes = [
      'subject_1'  // Renamed to: subjectId
    ];
    
    for (const indexName of obsoleteSessionIndexes) {
      const exists = sessionIndexes.some(idx => idx.name === indexName);
      if (exists) {
        await sessionsCollection.dropIndex(indexName);
        console.log(`[MIGRATION] ✓ Dropped obsolete session index: ${indexName}`);
      }
    }
    
    console.log('[MIGRATION] ✓ Index cleanup completed');
    
  } catch (error) {
    console.error('[MIGRATION] Error during index cleanup:', error);
    // Don't throw - allow app to continue even if migration fails
  }
};

/**
 * Sync Mongoose model indexes
 * This will create indexes defined in schema
 */
const syncModelIndexes = async () => {
  console.log('[MIGRATION] Syncing model indexes...');
  
  try {
    // Get all registered models
    const modelNames = mongoose.modelNames();
    
    for (const modelName of modelNames) {
      try {
        const model = mongoose.model(modelName);
        
        // Use createIndexes instead of syncIndexes to avoid conflicts
        await model.createIndexes();
        console.log(`[MIGRATION] ✓ Synced indexes for model: ${modelName}`);
      } catch (error) {
        // Ignore index already exists errors (code 86)
        if (error.code === 86 || error.codeName === 'IndexKeySpecsConflict') {
          console.log(`[MIGRATION] ℹ Indexes already exist for model: ${modelName}`);
        } else {
          console.error(`[MIGRATION] Error syncing indexes for ${modelName}:`, error.message);
        }
      }
    }
    
    console.log('[MIGRATION] ✓ Model index sync completed');
    
  } catch (error) {
    console.error('[MIGRATION] Error syncing indexes:', error);
    // Don't throw - allow app to continue
  }
};

/**
 * Clean up invalid data (optional)
 */
const cleanupInvalidData = async () => {
  console.log('[MIGRATION] Starting data cleanup...');
  
  try {
    const db = mongoose.connection.db;
    
    // Remove tutor documents with invalid maCB field
    const tutorsCollection = db.collection('tutors');
    const result = await tutorsCollection.updateMany(
      { maCB: { $exists: true } },
      { $unset: { maCB: '' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`[MIGRATION] ✓ Removed maCB field from ${result.modifiedCount} tutor documents`);
    }
    
    // Remove expertise field (replaced by subjectIds)
    const expertiseResult = await tutorsCollection.updateMany(
      { expertise: { $exists: true } },
      { $unset: { expertise: '' } }
    );
    
    if (expertiseResult.modifiedCount > 0) {
      console.log(`[MIGRATION] ✓ Removed expertise field from ${expertiseResult.modifiedCount} tutor documents`);
    }
    
    // Remove type field
    const typeResult = await tutorsCollection.updateMany(
      { type: { $exists: true } },
      { $unset: { type: '' } }
    );
    
    if (typeResult.modifiedCount > 0) {
      console.log(`[MIGRATION] ✓ Removed type field from ${typeResult.modifiedCount} tutor documents`);
    }
    
    // Rename subject to subjectId in sessions
    const sessionsCollection = db.collection('tutorsessions');
    const sessionResult = await sessionsCollection.updateMany(
      { subject: { $exists: true } },
      [{ $set: { subjectId: '$subject' } }, { $unset: 'subject' }]
    );
    
    if (sessionResult.modifiedCount > 0) {
      console.log(`[MIGRATION] ✓ Renamed subject to subjectId in ${sessionResult.modifiedCount} session documents`);
    }
    
    console.log('[MIGRATION] ✓ Data cleanup completed');
    
  } catch (error) {
    console.error('[MIGRATION] Error during data cleanup:', error);
    // Don't throw - allow app to continue
  }
};

/**
 * Run all migrations
 * Call this after MongoDB connection is established
 */
const runMigrations = async () => {
  console.log('[MIGRATION] ========================================');
  console.log('[MIGRATION] Starting database migrations...');
  console.log('[MIGRATION] ========================================');
  
  try {
    // Step 1: Drop obsolete indexes
    await dropObsoleteIndexes();
    
    // Step 2: Clean up invalid data
    await cleanupInvalidData();
    
    // Step 3: Sync model indexes
    await syncModelIndexes();
    
    console.log('[MIGRATION] ========================================');
    console.log('[MIGRATION] ✓ All migrations completed successfully');
    console.log('[MIGRATION] ========================================');
    
  } catch (error) {
    console.error('[MIGRATION] Migration failed:', error);
    // Don't crash the app - log error and continue
  }
};

export {
  runMigrations,
  dropObsoleteIndexes,
  syncModelIndexes,
  cleanupInvalidData
};
