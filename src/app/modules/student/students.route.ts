import express from 'express'
import { studentControllers } from './students.controller'
import validateRequest from '../../middlewares/validateRequest'
import { StudentValidationZodSchema } from './students.validation.zod'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty'),
  studentControllers.getAllStudent,
)
router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty'),
  studentControllers.getSingleStudent,
)
router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(StudentValidationZodSchema.updateStudentValidationZodSchema),
  studentControllers.updateStudent,
)
router.delete(
  '/delete/:id',
  auth('superAdmin', 'admin'),
  studentControllers.deleteSingleStudent,
)

export const StudentRoutes = router
