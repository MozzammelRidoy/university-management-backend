"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentValidation = void 0;
const zod_1 = require("zod");
const createAcademicDepartmentValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic Faculty Must be a String!',
            required_error: 'Name is Required',
        }),
        academicFaculty: zod_1.z.string({
            invalid_type_error: 'Academic Faculty Must be a String!',
            required_error: 'Faculty ID is Required',
        }),
    }),
});
const updateAcademicDepartmentValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            invalid_type_error: 'Academic Faculty Must be a String!',
            required_error: 'Name is Required',
        })
            .optional(),
        academicFaculty: zod_1.z
            .string({
            invalid_type_error: 'Academic Faculty Must be a String!',
            required_error: 'Faculty ID is Required',
        })
            .optional(),
    }),
});
exports.AcademicDepartmentValidation = {
    createAcademicDepartmentValidationZodSchema,
    updateAcademicDepartmentValidationZodSchema,
};
