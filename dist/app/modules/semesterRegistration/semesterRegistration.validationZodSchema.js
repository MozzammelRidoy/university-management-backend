"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationValidation = void 0;
const zod_1 = require("zod");
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
const createSemesterRegistrationValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicSemester: zod_1.z.string(),
        status: zod_1.z.enum([...semesterRegistration_constant_1.SemesterRagistrationStatus]),
        startDate: zod_1.z.string().datetime(),
        endDate: zod_1.z.string().datetime(),
        minCredit: zod_1.z.number(),
        maxCredit: zod_1.z.number(),
    }),
});
const updateSemesterRegistrationValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicSemester: zod_1.z.string().optional(),
        status: zod_1.z
            .enum([...semesterRegistration_constant_1.SemesterRagistrationStatus])
            .optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        minCredit: zod_1.z.number().optional(),
        maxCredit: zod_1.z.number().optional(),
    }),
});
exports.SemesterRegistrationValidation = {
    createSemesterRegistrationValidationZodSchema,
    updateSemesterRegistrationValidationZodSchema,
};
