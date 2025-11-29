/**
 * Services Index
 * Central export point for all services
 */

// Auth Services
export { default as AuthService } from './auth/AuthService.js';
export { default as AuthorizationService } from './auth/AuthorizationService.js';
export { default as CASService } from './auth/CASService.js';

// User Services
export { default as UserService } from './user/UserService.js';
export { default as StudentService } from './user/StudentService.js';
export { default as TutorService } from './user/TutorService.js';

// Registration Services
export { default as CourseRegistrationService } from './registration/CourseRegistrationService.js';

// Schedule Services
export { default as ScheduleService } from './schedule/ScheduleService.js';
export { default as AvailabilityService } from './schedule/AvailabilityService.js';

// Session Services
export { default as SessionService } from './session/SessionService.js';
export { default as RecordService } from './session/RecordService.js';

// Report Services
export { default as ReportService } from './report/ReportService.js';

// Notification Services
export { default as NotificationService } from './notification/NotificationService.js';

// Integration Services
export { default as DatacoreService } from './integration/DatacoreService.js';
export { default as SSOService } from './integration/SSOService.js';
export { default as LibraryService } from './integration/LibraryService.js';

// Sync Services
export { default as DataSyncService } from './sync/DataSyncService.js';
