import { z } from 'zod'
import { SemesterRagistrationStatus } from './semesterRegistration.constant'

const createSemesterRegistrationValidationZodSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(SemesterRagistrationStatus as [string, ...string[]])]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
})
const updateSemesterRegistrationValidationZodSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...(SemesterRagistrationStatus as [string, ...string[]])])
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
})

export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidationZodSchema,
  updateSemesterRegistrationValidationZodSchema,
}
