import express from 'express'
import { AcademicFacultyController } from './academicFaculty.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyValidation } from './academicFaculty.validationZodSchema'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  AcademicFacultyController.getAllAcademicFaculties,
)

router.get(
  '/:facultyId',
  auth('admin', 'faculty', 'student'),
  AcademicFacultyController.getSingleAcademicFaculty,
)

router.post(
  '/create-academic-faculty',
  auth('superAdmin', 'admin'),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationZodSchema,
  ),
  AcademicFacultyController.createAcademicFaculty,
)

router.patch(
  '/:facultyId',
  auth('superAdmin', 'admin'),
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationZodSchema,
  ),
  AcademicFacultyController.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
