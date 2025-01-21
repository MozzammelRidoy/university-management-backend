import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegistrationValidation } from './semesterRegistration.validationZodSchema'
import { SemesterRagistrationControllers } from './semesterRegistration.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-semester-registration',
  auth('superAdmin', 'admin'),
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationZodSchema,
  ),
  SemesterRagistrationControllers.createSemesterRegistration,
)

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  SemesterRagistrationControllers.getAllSemesterRegistrations,
)

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  SemesterRagistrationControllers.getSingleSemesterRegistration,
)

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationZodSchema,
  ),
  SemesterRagistrationControllers.updateSemesterRegistration,
)

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  SemesterRagistrationControllers.deleteSemesterRegistration,
)

export const SemesterRegistrationRoutes = router
