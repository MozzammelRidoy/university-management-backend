import express, { NextFunction, Request, Response } from 'express'
import { studentControllers } from './students.controller'
import validateRequest from '../../middlewares/validateRequest'
import { StudentValidationZodSchema } from './students.validation.zod'
import auth from '../../middlewares/auth'
import { upload } from '../../utils/sendImageToCloudinary'

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
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(StudentValidationZodSchema.updateStudentValidationZodSchema),
  studentControllers.updateStudent,
)
router.delete(
  '/delete/:id',
  auth('superAdmin', 'admin'),
  studentControllers.deleteSingleStudent,
)

export const StudentRoutes = router
