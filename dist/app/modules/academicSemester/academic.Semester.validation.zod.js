"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidation = void 0;
const zod_1 = require("zod");
const academic_Semester_constant_1 = require("./academic.Semester.constant");
const createAcademicSemesterValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum([...academic_Semester_constant_1.AcademicSemeterName]),
        year: zod_1.z.string(),
        code: zod_1.z.enum([...academic_Semester_constant_1.AcademicSemeterCode]),
        startMonth: zod_1.z.enum([...academic_Semester_constant_1.Months]),
        endMonth: zod_1.z.enum([...academic_Semester_constant_1.Months]),
    }),
});
const updateAcademicSemesterValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum([...academic_Semester_constant_1.AcademicSemeterName]).optional(),
        year: zod_1.z.string().optional(),
        code: zod_1.z.enum([...academic_Semester_constant_1.AcademicSemeterCode]).optional(),
        startMonth: zod_1.z.enum([...academic_Semester_constant_1.Months]).optional(),
        endMonth: zod_1.z.enum([...academic_Semester_constant_1.Months]).optional(),
    }),
});
exports.AcademicSemesterValidation = {
    createAcademicSemesterValidationZodSchema,
    updateAcademicSemesterValidationZodSchema,
};
