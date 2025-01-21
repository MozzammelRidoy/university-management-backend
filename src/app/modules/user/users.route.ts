import express, { NextFunction, Request, Response } from 'express'
import { usersControllers } from './users.controller'
import validateRequest from '../../middlewares/validateRequest'
import { StudentValidationZodSchema } from '../student/students.validation.zod'
import { FacultyValidationZodSchema } from '../faculty/faculty.ValidationZodSchema'
import { AdminValidationsZodSchema } from '../admin/admin.ValidationZodSchema'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'
import { userValidation } from './users.validation.zod'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.post(
  '/create-student',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(StudentValidationZodSchema.createStudentValidationZodSchema),
  usersControllers.createStudent,
)

router.post(
  '/create-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(FacultyValidationZodSchema.createFacultyValidationZodSchema),
  usersControllers.createFaculty,
)
router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(AdminValidationsZodSchema.createAdminValidationSchema),
  usersControllers.createAdmin,
)

router.get(
  '/me',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  usersControllers.getMe,
)

router.post(
  '/change-status/:id',
  auth('superAdmin', 'admin'),
  validateRequest(userValidation.changeUserStatusValidationZodSchema),
  usersControllers.changeUserStataus,
)
export const UserRoutes = router
