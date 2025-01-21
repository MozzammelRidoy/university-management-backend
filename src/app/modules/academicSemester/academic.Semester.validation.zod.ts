import { z } from 'zod'
import {
  AcademicSemeterCode,
  AcademicSemeterName,
  Months,
} from './academic.Semester.constant'

const createAcademicSemesterValidationZodSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemeterName] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...AcademicSemeterCode] as [string, ...string[]]),
    startMonth: z.enum([...Months] as [string, ...string[]]),
    endMonth: z.enum([...Months] as [string, ...string[]]),
  }),
})

const updateAcademicSemesterValidationZodSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemeterName] as [string, ...string[]]).optional(),
    year: z.string().optional(),
    code: z.enum([...AcademicSemeterCode] as [string, ...string[]]).optional(),
    startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  }),
})

export const AcademicSemesterValidation = {
  createAcademicSemesterValidationZodSchema,
  updateAcademicSemesterValidationZodSchema,
}
