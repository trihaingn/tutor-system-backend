/**
 * SWAGGER CONFIGURATION
 * FILE: swagger.config.js
 * MỤC ĐÍCH: Cấu hình Swagger UI để document REST API
 */

import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HCMUT Tutor System API',
    version: '1.0.0',
    description: 'REST API documentation for HCMUT Tutor System - Student-Tutor matching platform',
    contact: {
      name: 'API Support',
      email: 'support@hcmut.edu.vn'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1',
      description: 'Development server - API v1'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from /auth/login or /auth/cas/callback'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT token stored in cookie (automatically set after login)'
      }
    },
    schemas: {
      // Common Response Schemas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            description: 'Response data'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          stack: {
            type: 'string',
            description: 'Stack trace (only in development)',
            example: 'Error: ...'
          }
        }
      },
      PaginationResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              type: 'object'
            }
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                example: 1
              },
              limit: {
                type: 'integer',
                example: 20
              },
              total: {
                type: 'integer',
                example: 100
              },
              totalPages: {
                type: 'integer',
                example: 5
              }
            }
          }
        }
      },
      // User & Auth Schemas
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
          },
          email: {
            type: 'string',
            example: 'student@hcmut.edu.vn'
          },
          fullName: {
            type: 'string',
            example: 'Nguyễn Văn A'
          },
          studentId: {
            type: 'string',
            example: '2012345'
          },
          role: {
            type: 'string',
            enum: ['STUDENT', 'TUTOR', 'ADMIN'],
            example: 'STUDENT'
          },
          faculty: {
            type: 'string',
            example: 'Khoa Khoa học và Kỹ thuật Máy tính'
          },
          phoneNumber: {
            type: 'string',
            example: '0901234567'
          },
          isActive: {
            type: 'boolean',
            example: true
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'student@hcmut.edu.vn'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123'
          }
        }
      },
      // Tutor Schemas
      Tutor: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
          },
          userId: {
            $ref: '#/components/schemas/User'
          },
          type: {
            type: 'string',
            enum: ['LECTURER', 'RESEARCH_STUDENT', 'SENIOR_STUDENT'],
            example: 'SENIOR_STUDENT'
          },
          expertise: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                subjectId: {
                  type: 'string',
                  example: 'Math_101'
                },
                subjectName: {
                  type: 'string',
                  example: 'Giải tích 1'
                },
                yearsOfExperience: {
                  type: 'number',
                  example: 2
                }
              }
            }
          },
          averageRating: {
            type: 'number',
            format: 'float',
            example: 4.5
          },
          totalSessions: {
            type: 'integer',
            example: 15
          },
          isAcceptingStudents: {
            type: 'boolean',
            example: true
          }
        }
      },
      // Session Schemas
      TutorSession: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
          },
          tutorId: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
          },
          title: {
            type: 'string',
            example: 'Math 101 - Derivatives'
          },
          subjectId: {
            type: 'string',
            example: 'CNPM_NC',
            description: 'Subject identifier (e.g., Math_101, CNPM_NC)'
          },
          description: {
            type: 'string',
            example: 'Advanced calculus concepts and practical examples'
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T14:00:00Z',
            description: 'Must be on the hour (HH:00:00) per BR-001'
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T16:00:00Z',
            description: 'Must be on the hour (HH:00:00) per BR-001'
          },
          duration: {
            type: 'integer',
            example: 120,
            description: 'Duration in minutes (minimum 60 per BR-002)'
          },
          sessionType: {
            type: 'string',
            enum: ['ONLINE', 'OFFLINE'],
            example: 'OFFLINE'
          },
          location: {
            type: 'string',
            example: 'H6-201',
            description: 'Physical location (OFFLINE) or meeting link (ONLINE)'
          },
          participants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                studentId: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439012'
                },
                registeredAt: {
                  type: 'string',
                  format: 'date-time'
                },
                attended: {
                  type: 'boolean',
                  default: false
                }
              }
            }
          },
          status: {
            type: 'string',
            enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
            example: 'SCHEDULED'
          },
          hasReport: {
            type: 'boolean',
            default: false
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      CreateSessionRequest: {
        type: 'object',
        required: ['title', 'subjectId', 'startTime', 'endTime', 'sessionType', 'location'],
        properties: {
          title: {
            type: 'string',
            example: 'Hướng dẫn Công nghệ phần mềm'
          },
          subjectId: {
            type: 'string',
            example: 'CNPM_NC'
          },
          description: {
            type: 'string',
            example: 'Hướng dẫn về design patterns và best practices'
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T14:00:00Z'
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T16:00:00Z'
          },
          sessionType: {
            type: 'string',
            enum: ['ONLINE', 'OFFLINE'],
            example: 'OFFLINE'
          },
          location: {
            type: 'string',
            example: 'H6-201',
            description: 'Physical room (OFFLINE) or meeting link (ONLINE)'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    },
    {
      cookieAuth: []
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'SSO/CAS authentication endpoints'
    },
    {
      name: 'Students',
      description: 'Student profile and appointments'
    },
    {
      name: 'Tutors',
      description: 'Tutor search and profile management'
    },
    {
      name: 'Registration',
      description: 'Course registration management'
    },
    {
      name: 'Schedule',
      description: 'Tutor availability scheduling'
    },
    {
      name: 'Sessions',
      description: 'Tutoring session management'
    },
    {
      name: 'Notifications',
      description: 'User notifications'
    },
    {
      name: 'Records',
      description: 'Session reports and records'
    },
    {
      name: 'Feedback & Rating',
      description: 'Student and tutor evaluations'
    }
  ]
};

const options = {
  swaggerDefinition,
  // Path to the API routes files with JSDoc annotations
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
