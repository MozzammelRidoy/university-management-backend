import express from 'express'
import { AcademicDepartmentController } from './academicDepartment.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicDepartmentValidation } from './academicDepartment.validationZodSchema'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  AcademicDepartmentController.getAllAcademicDepartments,
)

router.get(
  '/:departmentId',
  auth('admin', 'faculty', 'student'),
  AcademicDepartmentController.getSingleAcademicDepartment,
)

router.post(
  '/create-academic-department',
  auth('superAdmin', 'admin'),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationZodSchema,
  ),
  AcademicDepartmentController.createAcademicDepartment,
)

router.patch(
  '/:departmentId',
  auth('superAdmin', 'admin'),
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationZodSchema,
  ),
  AcademicDepartmentController.updateAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
