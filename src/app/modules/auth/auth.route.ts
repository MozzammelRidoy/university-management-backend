import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validationZodSchema'
import { AuthController } from './auth.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationZodSchema),
  AuthController.loginUser,
)
router.post(
  '/change-password',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  validateRequest(AuthValidation.changePasswordValidationZodSchema),
  AuthController.changePassword,
)

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationZodSchema),
  AuthController.refreshToken,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationZodSchema),
  AuthController.forgetPassword,
)

router.post(
  '/reset-password',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  validateRequest(AuthValidation.resetPasswordValidationZodSchema),
  AuthController.resetPassword,
)
export const AuthRoutes = router
