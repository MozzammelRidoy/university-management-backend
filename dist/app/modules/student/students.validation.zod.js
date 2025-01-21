"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidationZodSchema = void 0;
const zod_1 = require("zod");
const createUserNameValidationZodSchema = zod_1.z.object({
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
const createGuardianValidationZodSchema = zod_1.z.object({
    fatherName: zod_1.z.string().trim().min(1, { message: 'Father Name is Required' }),
    fatherOccupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Father Occupation is Required' }),
    fatherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Father Contact Number is Required' }),
    motherName: zod_1.z.string().trim().min(1, { message: 'Mother Name is Required' }),
    motherOccupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Mother Occupation is Required' }),
    motherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Mother Contact No is Required' }),
});
const createLocalGuardianValidationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Name is Required' }),
    occupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Occupation is Required' }),
    contactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Contact No is Required' }),
    address: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Address is Required' }),
});
const createStudentValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Password is Required' })
            .max(20, { message: 'Password Maximum 20 Characters' })
            .optional(),
        student: zod_1.z.object({
            name: createUserNameValidationZodSchema,
            gender: zod_1.z.enum(['male', 'female', 'other'], {
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
                .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'], {
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
            guardian: createGuardianValidationZodSchema,
            localGuardian: createLocalGuardianValidationZodSchema,
            // profileImage: z.string().optional(),
            addmissionSemester: zod_1.z.string(),
            academicDepartment: zod_1.z.string(),
        }),
    }),
});
const updateUserNameValidationZodSchema = zod_1.z.object({
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
const updateGuardianValidationZodSchema = zod_1.z.object({
    fatherName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Father Name is Required' })
        .optional(),
    fatherOccupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Father Occupation is Required' })
        .optional(),
    fatherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Father Contact Number is Required' })
        .optional(),
    motherName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Mother Name is Required' })
        .optional(),
    motherOccupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Mother Occupation is Required' })
        .optional(),
    motherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Mother Contact No is Required' })
        .optional(),
});
const updateLocalGuardianValidationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Name is Required' })
        .optional(),
    occupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Occupation is Required' })
        .optional(),
    contactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Contact No is Required' })
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Local Guardian Address is Required' })
        .optional(),
});
const updateStudentValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Password is Required' })
            .max(20, { message: 'Password Maximum 20 Characters' })
            .optional(),
        student: zod_1.z.object({
            name: updateUserNameValidationZodSchema.optional(),
            gender: zod_1.z
                .enum(['male', 'female', 'other'], {
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
                .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'], {
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
            guardian: updateGuardianValidationZodSchema.optional(),
            localGuardian: updateLocalGuardianValidationZodSchema.optional(),
            profileImage: zod_1.z.string().optional(),
            addmissionSemester: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string().optional(),
        }),
    }),
});
exports.StudentValidationZodSchema = {
    createStudentValidationZodSchema,
    updateStudentValidationZodSchema,
};
