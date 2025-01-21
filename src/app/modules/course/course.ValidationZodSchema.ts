import { z } from 'zod'

const createPreRequisiteCourseValidationZodSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
})
const createCourseValidationZodSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourses: z
      .array(createPreRequisiteCourseValidationZodSchema)
      .optional(),
  }),
})

const updatePreRequisiteCourseValidationZodSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
})
const updateCourseValidationZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .array(updatePreRequisiteCourseValidationZodSchema)
      .optional(),
  }),
})

const facultiesWithCourseValidationZodSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
})
export const CourseValidationZodSchema = {
  createCourseValidationZodSchema,
  updateCourseValidationZodSchema,
  facultiesWithCourseValidationZodSchema,
}
