"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidationZodSchema = void 0;
const zod_1 = require("zod");
const createPreRequisiteCourseValidationZodSchema = zod_1.z.object({
    course: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional(),
});
const createCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        prefix: zod_1.z.string(),
        code: zod_1.z.number(),
        credits: zod_1.z.number(),
        preRequisiteCourses: zod_1.z
            .array(createPreRequisiteCourseValidationZodSchema)
            .optional(),
    }),
});
const updatePreRequisiteCourseValidationZodSchema = zod_1.z.object({
    course: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional(),
});
const updateCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        prefix: zod_1.z.string().optional(),
        code: zod_1.z.number().optional(),
        credits: zod_1.z.number().optional(),
        preRequisiteCourses: zod_1.z
            .array(updatePreRequisiteCourseValidationZodSchema)
            .optional(),
    }),
});
const facultiesWithCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculties: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.CourseValidationZodSchema = {
    createCourseValidationZodSchema,
    updateCourseValidationZodSchema,
    facultiesWithCourseValidationZodSchema,
};
