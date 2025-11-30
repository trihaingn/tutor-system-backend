/**
 * SWAGGER ANNOTATIONS FOR SESSION ROUTES
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Tutoring session management
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new tutoring session
 *     description: Tutor creates a new available session slot (UC-10)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subjectId
 *               - startTime
 *               - endTime
 *               - location
 *             properties:
 *               subjectId:
 *                 type: string
 *                 example: Math_101
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T14:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T16:00:00Z
 *               location:
 *                 type: string
 *                 example: H6-201
 *               maxStudents:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Validation error
 *       501:
 *         description: Not implemented yet
 *
 * /sessions/upcoming:
 *   get:
 *     summary: Get upcoming sessions
 *     description: Get list of upcoming tutoring sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Filter by subject
 *       - in: query
 *         name: tutorId
 *         schema:
 *           type: string
 *         description: Filter by tutor
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
 *         description: List of upcoming sessions
 *       501:
 *         description: Not implemented yet
 *
 * /sessions/{sessionId}/book:
 *   post:
 *     summary: Book a tutoring session
 *     description: Student books an available session (UC-11)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID to book
 *     responses:
 *       200:
 *         description: Session booked successfully
 *       400:
 *         description: Session already booked or validation error
 *       404:
 *         description: Session not found
 *       501:
 *         description: Not implemented yet
 *
 * /sessions/{sessionId}/cancel:
 *   post:
 *     summary: Cancel a session
 *     description: Cancel a booked session (UC-12)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID to cancel
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Schedule conflict
 *     responses:
 *       200:
 *         description: Session cancelled successfully
 *       404:
 *         description: Session not found
 *       501:
 *         description: Not implemented yet
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student profile and appointments
 */

/**
 * @swagger
 * /students/me:
 *   get:
 *     summary: Get my student profile
 *     description: Student views their own profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 *       501:
 *         description: Not implemented yet
 *
 * /students/me/appointments:
 *   get:
 *     summary: Get my appointments
 *     description: Student views their booked sessions
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of student's appointments
 *       501:
 *         description: Not implemented yet
 *
 * /students/me/feedbacks:
 *   get:
 *     summary: Get my feedbacks
 *     description: Student views feedbacks they have given
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of feedbacks
 *       501:
 *         description: Not implemented yet
 */

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Tutor availability scheduling
 */

/**
 * @swagger
 * /schedule/availability:
 *   post:
 *     summary: Set availability
 *     description: Tutor sets their availability schedule (UC-09)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: 0=Sunday, 1=Monday, ..., 6=Saturday
 *                 example: 1
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               endTime:
 *                 type: string
 *                 example: "16:00"
 *     responses:
 *       201:
 *         description: Availability set successfully
 *       501:
 *         description: Not implemented yet
 *   get:
 *     summary: Get my availability
 *     description: Tutor views their availability schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of availability slots
 *       501:
 *         description: Not implemented yet
 *
 * /schedule/availability/{availabilityId}:
 *   put:
 *     summary: Update availability
 *     description: Update an existing availability slot
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: availabilityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability updated
 *       501:
 *         description: Not implemented yet
 *   delete:
 *     summary: Delete availability
 *     description: Remove an availability slot
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: availabilityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability deleted
 *       501:
 *         description: Not implemented yet
 */

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications
 *     description: Get list of user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of notifications
 *       501:
 *         description: Not implemented yet
 *
 * /notifications/{notificationId}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       501:
 *         description: Not implemented yet
 *
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Mark all user's notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       501:
 *         description: Not implemented yet
 *
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     description: Get count of unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 5
 *       501:
 *         description: Not implemented yet
 */

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Session reports and records
 */

/**
 * @swagger
 * /records/{sessionId}:
 *   post:
 *     summary: Create session report
 *     description: Tutor creates a report after completing a session (UC-13)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *                 example: Covered basic calculus concepts
 *               studentProgress:
 *                 type: string
 *                 example: Good understanding
 *               nextSteps:
 *                 type: string
 *                 example: Practice integration problems
 *     responses:
 *       201:
 *         description: Report created successfully
 *       501:
 *         description: Not implemented yet
 *   get:
 *     summary: Get session report
 *     description: Retrieve report for a specific session
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session report retrieved
 *       501:
 *         description: Not implemented yet
 *   put:
 *     summary: Update session report
 *     description: Update an existing session report
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report updated
 *       501:
 *         description: Not implemented yet
 */

/**
 * @swagger
 * tags:
 *   name: Feedback & Rating
 *   description: Student and tutor evaluations
 */

/**
 * @swagger
 * /feedback/student:
 *   post:
 *     summary: Submit student feedback
 *     description: Student submits feedback about a tutor after session (UC-14)
 *     tags: [Feedback & Rating]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - rating
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Very helpful tutor, explained concepts clearly
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       501:
 *         description: Not implemented yet
 *
 * /feedback/tutor:
 *   post:
 *     summary: Submit tutor feedback
 *     description: Tutor submits feedback about a student after session (UC-15)
 *     tags: [Feedback & Rating]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *               studentEngagement:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       501:
 *         description: Not implemented yet
 *
 * /feedback/session/{sessionId}:
 *   get:
 *     summary: Get session evaluations
 *     description: Get feedback and ratings for a specific session
 *     tags: [Feedback & Rating]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session evaluations retrieved
 *       501:
 *         description: Not implemented yet
 */

/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Course registration management
 */

/**
 * @swagger
 * /registration:
 *   post:
 *     summary: Register for a course
 *     description: Student registers for a tutoring course (UC-08)
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: Math_101_S2024
 *     responses:
 *       201:
 *         description: Registration successful
 *       501:
 *         description: Not implemented yet
 *   get:
 *     summary: Get my registrations
 *     description: Student views their course registrations
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of registrations
 *       501:
 *         description: Not implemented yet
 *
 * /registration/{registrationId}:
 *   delete:
 *     summary: Cancel registration
 *     description: Student cancels a course registration
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration cancelled
 *       501:
 *         description: Not implemented yet
 */
