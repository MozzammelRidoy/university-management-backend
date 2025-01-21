import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidation } from './enrolledCourse.validationZodSchema'
import { EnrolledCourseControllers } from './enrolledCourse.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(
    EnrolledCourseValidation.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrollCourse,
)

router.get(
  '/my-enrolled-course',
  auth('student'),
  EnrolledCourseControllers.getMyEnrolledCourses,
)

router.patch(
  '/update-enrolled-course-marks',
  auth('superAdmin', 'admin', 'faculty'),
  validateRequest(
    EnrolledCourseValidation.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
)

export const EnrolledCourseRoutes = router
