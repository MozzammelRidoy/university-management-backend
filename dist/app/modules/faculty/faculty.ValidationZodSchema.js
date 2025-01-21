"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyValidationZodSchema = void 0;
const zod_1 = require("zod");
const faculty_Constant_1 = require("./faculty.Constant");
const createFacultyNameValidationZodSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'First Name is Required' })
        .max(20, { message: 'First Name cannot be more than 20 characters.' })
        .refine(value => /^[A-Z][a-z]*$/.test(value), {
        message: 'First Name must be in Capitalized Format',
    }),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Last Name is Required' })
        .refine(value => /^[A-Za-z]+$/.test(value), {
        message: 'Last Name must contain only alphabets.',
    }),
});
const createFacultyValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Password is Required' })
            .max(20, { message: 'Password Maximum 20 Characters' }),
        faculty: zod_1.z.object({
            name: createFacultyNameValidationZodSchema,
            gender: zod_1.z.enum([...faculty_Constant_1.Gender], {
                errorMap: () => ({ message: 'Gender must be male, female, or other' }),
            }),
            dateOfBirth: zod_1.z.string().trim(),
            email: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Email is Required' })
                .email({ message: 'Invalid email format' }),
            contactNo: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Contact Number is Required' }),
            emergencyContactNo: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Emergency Contact Number is Required' }),
            bloodGroup: zod_1.z
                .enum([...faculty_Constant_1.BloodGroup], {
                errorMap: () => ({ message: 'Invalid blood group' }),
            })
                .optional(),
            presentAddress: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Present Address is Required' }),
            permanentAddress: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Permanent Address is Required' }),
            profileImage: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string(),
        }),
    }),
});
const updateFacultyNameValidationZodSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'First Name is Required' })
        .max(20, { message: 'First Name cannot be more than 20 characters.' })
        .refine(value => /^[A-Z][a-z]*$/.test(value), {
        message: 'First Name must be in Capitalized Format',
    })
        .optional(),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Last Name is Required' })
        .refine(value => /^[A-Za-z]+$/.test(value), {
        message: 'Last Name must contain only alphabets.',
    })
        .optional(),
});
const updateFacultyValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Password is Required' })
            .max(20, { message: 'Password Maximum 20 Characters' })
            .optional(),
        faculty: zod_1.z.object({
            name: updateFacultyNameValidationZodSchema.optional(),
            gender: zod_1.z
                .enum([...faculty_Constant_1.Gender], {
                errorMap: () => ({
                    message: 'Gender must be male, female, or other',
                }),
            })
                .optional(),
            dateOfBirth: zod_1.z.string().trim().optional(),
            email: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Email is Required' })
                .email({ message: 'Invalid email format' })
                .optional(),
            contactNo: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Contact Number is Required' })
                .optional(),
            emergencyContactNo: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Emergency Contact Number is Required' })
                .optional(),
            bloodGroup: zod_1.z
                .enum([...faculty_Constant_1.BloodGroup], {
                errorMap: () => ({ message: 'Invalid blood group' }),
            })
                .optional(),
            presentAddress: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Present Address is Required' })
                .optional(),
            permanentAddress: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Permanent Address is Required' })
                .optional(),
            profileImage: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string().optional(),
        }),
    }),
});
exports.FacultyValidationZodSchema = {
    createFacultyValidationZodSchema,
    updateFacultyValidationZodSchema,
};
