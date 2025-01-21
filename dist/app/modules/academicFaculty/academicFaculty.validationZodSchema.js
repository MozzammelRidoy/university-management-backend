"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyValidation = void 0;
const zod_1 = require("zod");
const createAcademicFacultyValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic Faculty Must be a String!',
            required_error: 'Name is Required',
        }),
    }),
});
const updateAcademicFacultyValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic Faculty Must be a String!',
        }),
    }),
});
exports.AcademicFacultyValidation = {
    createAcademicFacultyValidationZodSchema,
    updateAcademicFacultyValidationZodSchema,
};
