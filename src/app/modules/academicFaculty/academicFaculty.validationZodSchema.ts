import { z } from 'zod'

const createAcademicFacultyValidationZodSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty Must be a String!',
      required_error: 'Name is Required',
    }),
  }),
})
const updateAcademicFacultyValidationZodSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty Must be a String!',
    }),
  }),
})

export const AcademicFacultyValidation = {
  createAcademicFacultyValidationZodSchema,
  updateAcademicFacultyValidationZodSchema,
}
