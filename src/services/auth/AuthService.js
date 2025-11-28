/**
 * SERVICE: AuthService
 * FILE: AuthService.js
 * MỤC ĐÍCH: Handle authentication logic (UC-01, UC-02, UC-04)
 * 
 * USE CASES:
 * - UC-01: Login via SSO HCMUT
 * - UC-02: Logout
 * - UC-04: Auto-sync DATACORE on login (BR-007)
 * 
 * DEPENDENCIES:
 * - SSOService: Validate SSO ticket
 * - DatacoreService: Sync user data from DATACORE
 * - UserService: Create/Update User, Student, Tutor
 * - JWT: Generate/Verify tokens
 */

// ============================================================
// FUNCTION: validateSSOTicket(ticket)
// ============================================================
// PURPOSE: Validate SSO ticket từ HCMUT SSO portal
// 
// INPUT:
// - ticket: String (SSO ticket from callback, e.g., "ST-xxxxx")
// 
// PROCESS:
// 1. Call SSOService.validateTicket(ticket)
//    - Send request to SSO validation endpoint
//    - Receive user info: { email, mssv?, maCB?, fullName, faculty }
// 2. If valid → Return user info
// 3. If invalid → Throw AuthenticationError
// 
// OUTPUT:
// {
//   email: "user@hcmut.edu.vn",
//   mssv: "2210001",        // If student
//   maCB: "CB001",          // If staff/lecturer
//   fullName: "Nguyen Van A",
//   faculty: "Computer Science"
// }
// 
// ERROR HANDLING:
// - Invalid ticket → AuthenticationError("Invalid SSO ticket")
// - SSO service down → InternalServerError("SSO service unavailable")

// ============================================================
// FUNCTION: syncAndCreateUser(ssoUserInfo)
// ============================================================
// PURPOSE: Sync DATACORE và create/update User (BR-007)
// 
// INPUT:
// - ssoUserInfo: Object (from SSO validation)
// 
// PROCESS:
// 1. ⚠️ BR-007: Sync from DATACORE (if mssv/maCB exists)
//    - If mssv exists (Student) → Call DatacoreService.getStudentData(mssv)
//    - If maCB exists (Staff/Lecturer) → Call DatacoreService.getTutorData(maCB)
//    - Merge DATACORE data với SSO data
// 
// 2. Find or Create User:
//    - Query User by email
//    - If exists → Update fields (fullName, faculty, lastSyncAt, etc.)
//    - If not exists → Create new User
// 
// 3. Determine role:
//    - If mssv exists → role = 'STUDENT'
//    - If maCB exists → role = 'TUTOR' or 'ADMIN' (check DATACORE)
// 
// 4. Create/Update Student profile (if role = STUDENT):
//    - Query Student by userId
//    - If not exists → Create Student record
//    - Update: mssv, major, enrollmentYear, gpa, etc.
// 
// 5. Create/Update Tutor profile (if role = TUTOR or ADMIN):
//    - Query Tutor by userId
//    - If not exists → Create Tutor record
//    - Update: maCB, type, expertise, etc.
// 
// 6. Return complete user object with populated Student/Tutor
// 
// OUTPUT:
// {
//   userId: "ObjectId",
//   email: "user@hcmut.edu.vn",
//   fullName: "Nguyen Van A",
//   role: "STUDENT",
//   status: "ACTIVE",
//   student: {
//     mssv: "2210001",
//     major: "Computer Science",
//     gpa: 3.5
//   }
// }

// ============================================================
// FUNCTION: generateJWT(user)
// ============================================================
// PURPOSE: Generate JWT token for authenticated user
// 
// INPUT:
// - user: Object (User model instance)
// 
// PROCESS:
// 1. Extract payload:
//    - userId: user._id
//    - email: user.email
//    - role: user.role
//    - status: user.status
// 2. Sign JWT with secret key (from config)
// 3. Set expiration: 7 days (configurable)
// 4. Return JWT string
// 
// OUTPUT:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// 
// JWT PAYLOAD:
// {
//   userId: "ObjectId",
//   email: "user@hcmut.edu.vn",
//   role: "STUDENT",
//   status: "ACTIVE",
//   iat: 1234567890,
//   exp: 1234567890
// }

// ============================================================
// FUNCTION: verifyJWT(token)
// ============================================================
// PURPOSE: Verify JWT token (used in authMiddleware)
// 
// INPUT:
// - token: String (JWT token from Authorization header)
// 
// PROCESS:
// 1. Verify token signature with secret key
// 2. Check expiration
// 3. Decode payload
// 4. Return user info from payload
// 
// OUTPUT:
// {
//   userId: "ObjectId",
//   email: "user@hcmut.edu.vn",
//   role: "STUDENT",
//   status: "ACTIVE"
// }
// 
// ERROR HANDLING:
// - Invalid signature → AuthenticationError("Invalid token")
// - Expired token → AuthenticationError("Token expired")
// - Missing token → AuthenticationError("No token provided")

// ============================================================
// FUNCTION: login(ticket)
// ============================================================
// PURPOSE: Complete login flow (UC-01 + UC-04)
// 
// INPUT:
// - ticket: String (SSO ticket)
// 
// PROCESS:
// 1. Validate SSO ticket → Get ssoUserInfo
// 2. Sync DATACORE and create/update User → Get user
// 3. Generate JWT → Get token
// 4. Return { user, token }
// 
// OUTPUT:
// {
//   user: { userId, email, fullName, role, student/tutor },
//   token: "JWT string"
// }

const jwt = require('jsonwebtoken');
const SSOService = require('../integration/SSOService');
const DatacoreService = require('../integration/DatacoreService');
const UserService = require('../user/UserService');
const { AuthenticationError, InternalServerError } = require('../../middleware/errorMiddleware');

/**
 * Validate SSO ticket từ HCMUT SSO portal
 */
async function validateSSOTicket(ticket, service) {
  try {
    const ssoUserInfo = await SSOService.validateTicket(ticket, service);
    
    if (!ssoUserInfo) {
      throw new AuthenticationError('Invalid SSO ticket');
    }

    return ssoUserInfo;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new InternalServerError('SSO service unavailable');
  }
}

/**
 * Sync DATACORE và create/update User (BR-007)
 */
async function syncAndCreateUser(ssoUserInfo) {
  let datacoreData = null;
  let role = 'STUDENT'; // Default role
  let tutorType = null;

  // BR-007: Sync from DATACORE
  try {
    if (ssoUserInfo.mssv) {
      // Student - sync from DATACORE
      datacoreData = await DatacoreService.getStudentData(ssoUserInfo.mssv);
      role = 'STUDENT';
    } else if (ssoUserInfo.maCB) {
      // Staff/Lecturer - sync from DATACORE
      datacoreData = await DatacoreService.getTutorData(ssoUserInfo.maCB);
      role = DatacoreService.mapRole(datacoreData?.role || 'TUTOR');
      tutorType = DatacoreService.mapTutorType(datacoreData?.role);
    }
  } catch (error) {
    console.warn('DATACORE sync failed, using SSO data only:', error.message);
  }

  // Merge SSO + DATACORE data
  const userData = {
    email: ssoUserInfo.email,
    mssv: ssoUserInfo.mssv || datacoreData?.mssv || null,
    maCB: ssoUserInfo.maCB || datacoreData?.maCB || null,
    fullName: datacoreData?.fullName || ssoUserInfo.fullName,
    faculty: datacoreData?.faculty || ssoUserInfo.faculty,
    role: role,
    status: 'ACTIVE'
  };

  // Create or update User
  const user = await UserService.createOrUpdateUser(userData);

  // Create or update Student profile
  if (role === 'STUDENT' && ssoUserInfo.mssv) {
    const studentData = {
      mssv: ssoUserInfo.mssv,
      major: datacoreData?.major || ssoUserInfo.faculty,
      enrollmentYear: datacoreData?.enrollmentYear || new Date().getFullYear(),
      currentYear: datacoreData?.currentYear || 1,
      gpa: datacoreData?.gpa || 0,
      totalCredits: datacoreData?.totalCredits || 0
    };
    await UserService.createOrUpdateStudent(user._id, studentData);
  }

  // Create or update Tutor profile
  if ((role === 'TUTOR' || role === 'ADMIN') && ssoUserInfo.maCB) {
    const tutorData = {
      maCB: ssoUserInfo.maCB,
      type: tutorType || 'LECTURER',
      expertise: datacoreData?.expertise || [],
      bio: datacoreData?.bio || ''
    };
    await UserService.createOrUpdateTutor(user._id, tutorData);
  }

  // Return complete user with populated profile
  const completeUser = await UserService.getUserById(user._id);
  return completeUser;
}

/**
 * Generate JWT token for authenticated user
 */
function generateJWT(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    status: user.status
  };

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}

/**
 * Verify JWT token
 */
function verifyJWT(token) {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw new AuthenticationError('No token provided');
  }
}

/**
 * Complete login flow (UC-01 + UC-04)
 */
async function login(ticket, service) {
  // Step 1: Validate SSO ticket
  const ssoUserInfo = await validateSSOTicket(ticket, service);

  // Step 2: Sync DATACORE and create/update User
  const user = await syncAndCreateUser(ssoUserInfo);

  // Step 3: Generate JWT
  const token = generateJWT(user);

  // Step 4: Return user + token
  return {
    user: {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      mssv: user.mssv,
      maCB: user.maCB,
      student: user.student || null,
      tutor: user.tutor || null
    },
    token
  };
}

/**
 * Logout (UC-02)
 * Note: JWT is stateless, logout is handled client-side by removing token
 */
async function logout() {
  // In JWT-based auth, logout is client-side operation
  // Server-side logout would require token blacklisting (Redis)
  return { success: true, message: 'Logged out successfully' };
}

module.exports = {
  validateSSOTicket,
  syncAndCreateUser,
  generateJWT,
  verifyJWT,
  login,
  logout
};
