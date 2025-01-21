import { z } from 'zod'

const createAcademicDepartmentValidationZodSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty Must be a String!',
      required_error: 'Name is Required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty Must be a String!',
      required_error: 'Faculty ID is Required',
    }),
  }),
})

const updateAcademicDepartmentValidationZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Faculty Must be a String!',
        required_error: 'Name is Required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Faculty Must be a String!',
        required_error: 'Faculty ID is Required',
      })
      .optional(),
  }),
})

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationZodSchema,
  updateAcademicDepartmentValidationZodSchema,
}
