import { z } from 'zod'

const loginValidationZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

const changePasswordValidationZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old Password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
})

const refreshTokenValidationZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
})

const forgetPasswordValidationZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'Id is Required!',
    }),
  }),
})
const resetPasswordValidationZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'Id is Required!',
    }),
    newPassword: z.string({
      required_error: 'New Password is Required!',
    }),
  }),
})
export const AuthValidation = {
  loginValidationZodSchema,
  changePasswordValidationZodSchema,
  refreshTokenValidationZodSchema,
  forgetPasswordValidationZodSchema,
  resetPasswordValidationZodSchema,
}
