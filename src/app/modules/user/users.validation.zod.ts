import { z } from 'zod'
import { UserStatus } from './user.constant'

// const userValidationZodSchema = z.object({
//   id: z.string(),
//   password: z
//     .string()
//     .max(20, { message: 'Password can not be more thain 20 characters' }),
//   needsPasswordChange: z.boolean().optional().default(true),
//   role: z.enum(['admin', 'faculty', 'admin']),
//   status: z.enum(['in-progress', 'blocked']).default('in-progress'),
//   isDeleted: z.boolean().optional().default(false),
// })
const userValidationZodSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .max(20, { message: 'Password can not be more thain 20 characters' }),
})

const changeUserStatusValidationZodSchema = z.object({
  body: z.object({
    status: z.enum([...(UserStatus as [string, ...string[]])]),
  }),
})
export const userValidation = {
  userValidationZodSchema,
  changeUserStatusValidationZodSchema,
}
