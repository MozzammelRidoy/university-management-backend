import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidationZodSchema } from './course.ValidationZodSchema'
import { CoruseControllers } from './course.Controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-course',
  auth('superAdmin', 'admin'),
  validateRequest(CourseValidationZodSchema.createCourseValidationZodSchema),
  CoruseControllers.createCourse,
)

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CoruseControllers.getAllCourses,
)

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CoruseControllers.getSingleCourse,
)

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(CourseValidationZodSchema.updateCourseValidationZodSchema),
  CoruseControllers.updateCourse,
)

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  CoruseControllers.deleteCourse,
)

router.put(
  '/:courseId/assign-faculties',
  auth('superAdmin', 'admin'),
  validateRequest(
    CourseValidationZodSchema.facultiesWithCourseValidationZodSchema,
  ),
  CoruseControllers.assignFacultiesWithCourse,
)

router.get(
  '/:courseId/get-faculties',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CoruseControllers.getFacultiesWithCourse,
)
router.delete(
  '/:courseId/remove-faculties',
  auth('superAdmin', 'admin'),
  validateRequest(
    CourseValidationZodSchema.facultiesWithCourseValidationZodSchema,
  ),
  CoruseControllers.removeFacultiesFromCourse,
)
export const CourseRoutes = router
