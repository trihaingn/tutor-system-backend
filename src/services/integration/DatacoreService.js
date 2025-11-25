/**
 * SERVICE: DatacoreService
 * FILE: DatacoreService.js
 * MỤC ĐÍCH: Gọi API DATACORE để sync dữ liệu Student/Tutor (BR-007)
 * 
 * BUSINESS RULES:
 * - BR-007: Mỗi lần login, phải sync data từ DATACORE
 * - DATACORE là READ-ONLY source of truth
 * 
 * DEPENDENCIES:
 * - axios (HTTP client)
 * - DatacoreConfig (API URL, credentials)
 */

// ============================================================
// FUNCTION: getStudentData(mssv)
// ============================================================
// PURPOSE: Lấy thông tin Student từ DATACORE API
// 
// INPUT:
// - mssv: String (Student ID, e.g., "2210001")
// 
// PSEUDOCODE:
// Step 1: Build API request
//   - const url = `${DATACORE_API_URL}/students/${mssv}`
//   - const headers = {
//       'Authorization': `Bearer ${DATACORE_API_KEY}`,
//       'Content-Type': 'application/json'
//     }
// 
// Step 2: Call DATACORE API
//   - try {
//       const response = await axios.get(url, { headers })
//       const data = response.data
//     }
//   - catch (error):
//     → If error.response.status === 404:
//       → Throw NotFoundError("Student không tồn tại trong DATACORE")
//     → Else:
//       → Throw InternalServerError("Không thể kết nối DATACORE")
// 
// Step 3: Transform data (map DATACORE fields → our schema)
//   - return {
//       mssv: data.student_id,
//       fullName: data.full_name,
//       faculty: data.faculty,
//       major: data.major,
//       enrollmentYear: data.enrollment_year,
//       currentYear: data.current_year,
//       gpa: data.gpa,
//       totalCredits: data.total_credits,
//       email: data.email
//     }
// 
// OUTPUT:
// - Return transformed Student data

// ============================================================
// FUNCTION: getTutorData(maCB)
// ============================================================
// PURPOSE: Lấy thông tin Tutor (Lecturer/Staff) từ DATACORE API
// 
// INPUT:
// - maCB: String (Staff ID, e.g., "CB001")
// 
// PSEUDOCODE:
// Step 1: Build API request
//   - const url = `${DATACORE_API_URL}/staff/${maCB}`
//   - const headers = { 'Authorization': `Bearer ${DATACORE_API_KEY}` }
// 
// Step 2: Call DATACORE API
//   - try {
//       const response = await axios.get(url, { headers })
//       const data = response.data
//     }
//   - catch (error): Handle errors (404, 500)
// 
// Step 3: Transform data
//   - return {
//       maCB: data.staff_id,
//       fullName: data.full_name,
//       faculty: data.faculty,
//       email: data.email,
//       type: determineType(data.position), // Map position → LECTURER/RESEARCH_STUDENT
//       expertise: data.subjects?.map(subject => ({
//         subjectId: subject.id,
//         subjectName: subject.name,
//         yearsOfExperience: subject.years_teaching || 0
//       })) || []
//     }
// 
// OUTPUT:
// - Return transformed Tutor data

// ============================================================
// FUNCTION: determineType(position)
// ============================================================
// PURPOSE: Map DATACORE position → Tutor type enum
// 
// PSEUDOCODE:
// - If position includes 'Lecturer' OR 'Professor' → Return 'LECTURER'
// - If position includes 'PhD Student' OR 'Researcher' → Return 'RESEARCH_STUDENT'
// - Else → Return 'SENIOR_STUDENT' (default)

// ============================================================
// FUNCTION: validateDatacoreConnection()
// ============================================================
// PURPOSE: Health check DATACORE API (startup validation)
// 
// PSEUDOCODE:
// Step 1: Ping DATACORE health endpoint
//   - const url = `${DATACORE_API_URL}/health`
//   - try {
//       const response = await axios.get(url, { timeout: 5000 })
//       return { connected: true, status: response.status }
//     }
//   - catch (error):
//     → return { connected: false, error: error.message }
// 
// OUTPUT:
// - Return { connected: Boolean, status?: Number, error?: String }

// TODO: Import axios
// TODO: Import DatacoreConfig (API URL, API Key)
// TODO: Import error classes (NotFoundError, InternalServerError)

// TODO: Implement getStudentData(mssv)
// TODO: Implement getTutorData(maCB)
// TODO: Implement determineType(position)
// TODO: Implement validateDatacoreConnection()

// TODO: Export all functions
