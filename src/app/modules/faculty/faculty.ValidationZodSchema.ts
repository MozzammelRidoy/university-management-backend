import { z } from 'zod'
import { BloodGroup, Gender } from './faculty.Constant'

const createFacultyNameValidationZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First Name is Required' })
    .max(20, { message: 'First Name cannot be more than 20 characters.' })
    .refine(value => /^[A-Z][a-z]*$/.test(value), {
      message: 'First Name must be in Capitalized Format',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last Name is Required' })
    .refine(value => /^[A-Za-z]+$/.test(value), {
      message: 'Last Name must contain only alphabets.',
    }),
})

const createFacultyValidationZodSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password is Required' })
      .max(20, { message: 'Password Maximum 20 Characters' }),
    faculty: z.object({
      name: createFacultyNameValidationZodSchema,
      gender: z.enum([...Gender] as [string, ...string[]], {
        errorMap: () => ({ message: 'Gender must be male, female, or other' }),
      }),
      dateOfBirth: z.string().trim(),
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is Required' })
        .email({ message: 'Invalid email format' }),
      contactNo: z
        .string()
        .trim()
        .min(1, { message: 'Contact Number is Required' }),
      emergencyContactNo: z
        .string()
        .trim()
        .min(1, { message: 'Emergency Contact Number is Required' }),
      bloodGroup: z
        .enum([...BloodGroup] as [string, ...string[]], {
          errorMap: () => ({ message: 'Invalid blood group' }),
        })
        .optional(),
      presentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Present Address is Required' }),
      permanentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Permanent Address is Required' }),
      profileImage: z.string().optional(),
      academicDepartment: z.string(),
    }),
  }),
})
const updateFacultyNameValidationZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First Name is Required' })
    .max(20, { message: 'First Name cannot be more than 20 characters.' })
    .refine(value => /^[A-Z][a-z]*$/.test(value), {
      message: 'First Name must be in Capitalized Format',
    })
    .optional(),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last Name is Required' })
    .refine(value => /^[A-Za-z]+$/.test(value), {
      message: 'Last Name must contain only alphabets.',
    })
    .optional(),
})

const updateFacultyValidationZodSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password is Required' })
      .max(20, { message: 'Password Maximum 20 Characters' })
      .optional(),
    faculty: z.object({
      name: updateFacultyNameValidationZodSchema.optional(),
      gender: z
        .enum([...Gender] as [string, ...string[]], {
          errorMap: () => ({
            message: 'Gender must be male, female, or other',
          }),
        })
        .optional(),
      dateOfBirth: z.string().trim().optional(),
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is Required' })
        .email({ message: 'Invalid email format' })
        .optional(),
      contactNo: z
        .string()
        .trim()
        .min(1, { message: 'Contact Number is Required' })
        .optional(),
      emergencyContactNo: z
        .string()
        .trim()
        .min(1, { message: 'Emergency Contact Number is Required' })
        .optional(),
      bloodGroup: z
        .enum([...BloodGroup] as [string, ...string[]], {
          errorMap: () => ({ message: 'Invalid blood group' }),
        })
        .optional(),
      presentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Present Address is Required' })
        .optional(),
      permanentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Permanent Address is Required' })
        .optional(),
      profileImage: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
})

export const FacultyValidationZodSchema = {
  createFacultyValidationZodSchema,
  updateFacultyValidationZodSchema,
}
