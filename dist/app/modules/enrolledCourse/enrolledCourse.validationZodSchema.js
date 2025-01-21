"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseValidation = void 0;
const zod_1 = require("zod");
const createEnrolledCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourse: zod_1.z.string({ required_error: 'Offered Course is required!' }),
    }),
});
const updateEnrolledCourseMarksValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        semesterRegistration: zod_1.z.string(),
        offeredCourse: zod_1.z.string(),
        student: zod_1.z.string(),
        courseMarks: zod_1.z.object({
            classTest1: zod_1.z.number().min(0).max(10).optional(),
            midTerm: zod_1.z.number().min(0).max(30).optional(),
            classTest2: zod_1.z.number().min(0).max(10).optional(),
            finalTerm: zod_1.z.number().min(0).max(50).optional(),
        }),
    }),
});
exports.EnrolledCourseValidation = {
    createEnrolledCourseValidationZodSchema,
    updateEnrolledCourseMarksValidationZodSchema,
};
