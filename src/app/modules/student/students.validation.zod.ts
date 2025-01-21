import { z } from 'zod'

const createUserNameValidationZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First Name is Required' })
    .max(20, { message: 'First Name cannot be more than 20 characters.' })
    .refine(value => /^[A-Z][a-z]*$/.test(value), {
      message: 'First Name must be in Capitalized Format',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last Name is Required' })
    .refine(value => /^[A-Za-z]+$/.test(value), {
      message: 'Last Name must contain only alphabets.',
    }),
})

const createGuardianValidationZodSchema = z.object({
  fatherName: z.string().trim().min(1, { message: 'Father Name is Required' }),
  fatherOccupation: z
    .string()
    .trim()
    .min(1, { message: 'Father Occupation is Required' }),
  fatherContactNo: z
    .string()
    .trim()
    .min(1, { message: 'Father Contact Number is Required' }),
  motherName: z.string().trim().min(1, { message: 'Mother Name is Required' }),
  motherOccupation: z
    .string()
    .trim()
    .min(1, { message: 'Mother Occupation is Required' }),
  motherContactNo: z
    .string()
    .trim()
    .min(1, { message: 'Mother Contact No is Required' }),
})

const createLocalGuardianValidationZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Name is Required' }),
  occupation: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Occupation is Required' }),
  contactNo: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Contact No is Required' }),
  address: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Address is Required' }),
})

const createStudentValidationZodSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password is Required' })
      .max(20, { message: 'Password Maximum 20 Characters' })
      .optional(),
    student: z.object({
      name: createUserNameValidationZodSchema,
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender must be male, female, or other' }),
      }),
      dateOfBirth: z.string().trim(),
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is Required' })
        .email({ message: 'Invalid email format' }),
      contactNo: z
        .string()
        .trim()
        .min(1, { message: 'Contact Number is Required' }),
      emergencyContactNo: z
        .string()
        .trim()
        .min(1, { message: 'Emergency Contact Number is Required' }),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'], {
          errorMap: () => ({ message: 'Invalid blood group' }),
        })
        .optional(),
      presentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Present Address is Required' }),
      permanentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Permanent Address is Required' }),
      guardian: createGuardianValidationZodSchema,
      localGuardian: createLocalGuardianValidationZodSchema,
      // profileImage: z.string().optional(),
      addmissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
})

const updateUserNameValidationZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First Name is Required' })
    .max(20, { message: 'First Name cannot be more than 20 characters.' })
    .refine(value => /^[A-Z][a-z]*$/.test(value), {
      message: 'First Name must be in Capitalized Format',
    })
    .optional(),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last Name is Required' })
    .refine(value => /^[A-Za-z]+$/.test(value), {
      message: 'Last Name must contain only alphabets.',
    })
    .optional(),
})

const updateGuardianValidationZodSchema = z.object({
  fatherName: z
    .string()
    .trim()
    .min(1, { message: 'Father Name is Required' })
    .optional(),
  fatherOccupation: z
    .string()
    .trim()
    .min(1, { message: 'Father Occupation is Required' })
    .optional(),
  fatherContactNo: z
    .string()
    .trim()
    .min(1, { message: 'Father Contact Number is Required' })
    .optional(),
  motherName: z
    .string()
    .trim()
    .min(1, { message: 'Mother Name is Required' })
    .optional(),
  motherOccupation: z
    .string()
    .trim()
    .min(1, { message: 'Mother Occupation is Required' })
    .optional(),
  motherContactNo: z
    .string()
    .trim()
    .min(1, { message: 'Mother Contact No is Required' })
    .optional(),
})

const updateLocalGuardianValidationZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Name is Required' })
    .optional(),
  occupation: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Occupation is Required' })
    .optional(),
  contactNo: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Contact No is Required' })
    .optional(),
  address: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Address is Required' })
    .optional(),
})

const updateStudentValidationZodSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password is Required' })
      .max(20, { message: 'Password Maximum 20 Characters' })
      .optional(),
    student: z.object({
      name: updateUserNameValidationZodSchema.optional(),
      gender: z
        .enum(['male', 'female', 'other'], {
          errorMap: () => ({
            message: 'Gender must be male, female, or other',
          }),
        })
        .optional(),
      dateOfBirth: z.string().trim().optional(),
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is Required' })
        .email({ message: 'Invalid email format' })
        .optional(),
      contactNo: z
        .string()
        .trim()
        .min(1, { message: 'Contact Number is Required' })
        .optional(),
      emergencyContactNo: z
        .string()
        .trim()
        .min(1, { message: 'Emergency Contact Number is Required' })
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'], {
          errorMap: () => ({ message: 'Invalid blood group' }),
        })
        .optional(),
      presentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Present Address is Required' })
        .optional(),
      permanentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Permanent Address is Required' })
        .optional(),
      guardian: updateGuardianValidationZodSchema.optional(),
      localGuardian: updateLocalGuardianValidationZodSchema.optional(),
      profileImage: z.string().optional(),
      addmissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
})

export const StudentValidationZodSchema = {
  createStudentValidationZodSchema,
  updateStudentValidationZodSchema,
}
