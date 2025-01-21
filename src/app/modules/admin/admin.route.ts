import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AdminControllers } from './admin.Controller'
import { AdminValidationsZodSchema } from './admin.ValidationZodSchema'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get('/', auth('admin'), AdminControllers.getAllAdmins)

router.get('/:id', auth('admin'), AdminControllers.getSingleAdmin)

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(AdminValidationsZodSchema.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
)

router.delete('/:id', auth('admin'), AdminControllers.deleteAdmin)

export const AdminRoutes = router
