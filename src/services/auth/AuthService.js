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

// TODO: Import dependencies (SSOService, DatacoreService, UserService, jsonwebtoken)

// TODO: Implement validateSSOTicket(ticket)
// - Call SSOService.validateTicket()
// - Return user info or throw error

// TODO: Implement syncAndCreateUser(ssoUserInfo)
// - BR-007: Sync from DATACORE
// - Merge SSO + DATACORE data
// - Create/Update User, Student, Tutor
// - Return complete user object

// TODO: Implement generateJWT(user)
// - Extract payload
// - Sign JWT with secret
// - Return JWT string

// TODO: Implement verifyJWT(token)
// - Verify signature and expiration
// - Decode payload
// - Return user info

// TODO: Implement login(ticket)
// - Orchestrate: validateSSOTicket → syncAndCreateUser → generateJWT
// - Return { user, token }

// TODO: Export all functions
