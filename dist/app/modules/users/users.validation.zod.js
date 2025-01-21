"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
// const userValidationZodSchema = z.object({
//   id: z.string(),
//   password: z
//     .string()
//     .max(20, { message: 'Password can not be more thain 20 characters' }),
//   needsPasswordChange: z.boolean().optional().default(true),
//   role: z.enum(['admin', 'faculty', 'admin']),
//   status: z.enum(['in-progress', 'block']).default('in-progress'),
//   isDeleted: z.boolean().optional().default(false),
// })
const userValidationZodSchema = zod_1.z.object({
    password: zod_1.z
        .string({ invalid_type_error: 'Password must be string' })
        .max(20, { message: 'Password can not be more thain 20 characters' }),
});
exports.userValidation = { userValidationZodSchema };
