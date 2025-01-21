import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseValidation } from './offeredCourses.validationZodSchema'
import { OfferedCourseControllers } from './offeredCoures.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-offered-course',
  auth('superAdmin', 'admin'),
  validateRequest(
    OfferedCourseValidation.createOfferedCourseValidationZodSchema,
  ),
  OfferedCourseControllers.createOfferedCourse,
)

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  OfferedCourseControllers.getAllOfferedCourses,
)

router.get(
  '/my-offered-courses',
  auth('student'),
  OfferedCourseControllers.getMyOfferedCourses,
)
router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  OfferedCourseControllers.getSingleOfferedCourse,
)

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(
    OfferedCourseValidation.updateOfferedCourseValidationZodSchema,
  ),
  OfferedCourseControllers.updateOfferedCourse,
)

export const OfferedCourseRoutes = router
