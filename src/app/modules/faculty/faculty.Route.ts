import express from 'express'
import { FacultyController } from './faculty.Controler'
import validateRequest from '../../middlewares/validateRequest'
import { FacultyValidationZodSchema } from './faculty.ValidationZodSchema'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty'),
  FacultyController.getSingleFaculty,
)

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty'),
  FacultyController.getAllFaculties,
)

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(FacultyValidationZodSchema.updateFacultyValidationZodSchema),
  FacultyController.updateFaculty,
)

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  FacultyController.deleteFaculty,
)

export const FacultyRoutes = router
