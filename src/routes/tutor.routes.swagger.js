/**
 * SWAGGER ANNOTATIONS FOR TUTOR ROUTES
 * FILE: tutor.routes.js (Swagger section)
 */

/**
 * @swagger
 * tags:
 *   name: Tutors
 *   description: Tutor search and profile management
 */

/**
 * @swagger
 * /tutors/search:
 *   get:
 *     summary: Search for tutors
 *     description: Student searches for tutors by subject, type, rating (UC-07)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Subject ID to search for
 *         example: Math_101
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [LECTURER, RESEARCH_STUDENT, SENIOR_STUDENT]
 *         description: Type of tutor
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum average rating
 *         example: 4.0
 *       - in: query
 *         name: isAcceptingStudents
 *         schema:
 *           type: boolean
 *         description: Filter tutors accepting new students
 *         example: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *         example: 20
 *     responses:
 *       200:
 *         description: List of tutors matching search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tutor'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 45
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /tutors/by-hcmut-id/{hcmutId}:
 *   get:
 *     summary: Get tutor by HCMUT ID
 *     description: Get tutor profile using HCMUT staff ID (maCB) from DATACORE
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: hcmutId
 *         required: true
 *         schema:
 *           type: string
 *         description: HCMUT Staff ID (maCB from DATACORE)
 *         example: "004001"
 *     responses:
 *       200:
 *         description: Tutor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tutor'
 *       404:
 *         description: Tutor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /tutors/me:
 *   get:
 *     summary: Get my tutor profile
 *     description: Tutor views their own profile (UC-20)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tutor profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tutor'
 *       401:
 *         description: Unauthorized
 *       501:
 *         description: Not implemented yet
 *
 * /tutors/me/sessions:
 *   get:
 *     summary: Get my tutoring sessions
 *     description: Tutor views their own sessions (UC-21)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, COMPLETED, CANCELLED]
 *         description: Filter by session status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *     responses:
 *       200:
 *         description: List of tutor's sessions
 *       501:
 *         description: Not implemented yet
 *
 * /tutors/me/feedbacks:
 *   get:
 *     summary: Get feedbacks received
 *     description: Tutor views feedbacks received from students (UC-22)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of feedbacks
 *       501:
 *         description: Not implemented yet
 *
 * /tutors/by-hcmut-id/{hcmutId}/availability:
 *   get:
 *     summary: Get tutor availability by HCMUT ID
 *     description: Get availability schedule using HCMUT staff ID (maCB)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: hcmutId
 *         required: true
 *         schema:
 *           type: string
 *         description: HCMUT Staff ID (maCB)
 *         example: "004001"
 *     responses:
 *       200:
 *         description: Tutor availability schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tutorId:
 *                         type: string
 *                       dayOfWeek:
 *                         type: number
 *                         description: 0=Sunday, 1=Monday, ..., 6=Saturday
 *                         example: 1
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "11:00"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: Tutor not found
 *

 */
