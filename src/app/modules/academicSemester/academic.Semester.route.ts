import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterValidation } from './academic.Semester.validation.zod'
import { AcademicSemesterControllers } from './academic.Semester.controller'
import auth from '../../middlewares/auth'
const router = express.Router()

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  AcademicSemesterControllers.getAllSemester,
)

router.get(
  '/:semesterId',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  AcademicSemesterControllers.getSingleSemester,
)

router.post(
  '/create-academic-semester',
  auth('superAdmin', 'admin'),
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationZodSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
)

router.put(
  '/update-academic-semester/:semesterId',
  auth('superAdmin', 'admin'),
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationZodSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
)

export const AcademicSemesterRoutes = router
