"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
// const userValidationZodSchema = z.object({
//   id: z.string(),
//   password: z
//     .string()
//     .max(20, { message: 'Password can not be more thain 20 characters' }),
//   needsPasswordChange: z.boolean().optional().default(true),
//   role: z.enum(['admin', 'faculty', 'admin']),
//   status: z.enum(['in-progress', 'blocked']).default('in-progress'),
//   isDeleted: z.boolean().optional().default(false),
// })
const userValidationZodSchema = zod_1.z.object({
    password: zod_1.z
        .string({ invalid_type_error: 'Password must be string' })
        .max(20, { message: 'Password can not be more thain 20 characters' }),
});
const changeUserStatusValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...user_constant_1.UserStatus]),
    }),
});
exports.userValidation = {
    userValidationZodSchema,
    changeUserStatusValidationZodSchema,
};
