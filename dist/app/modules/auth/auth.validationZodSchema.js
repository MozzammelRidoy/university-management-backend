"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'ID is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const changePasswordValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old Password is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password is required',
        }),
    }),
});
const refreshTokenValidationZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});
const forgetPasswordValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Id is Required!',
        }),
    }),
});
const resetPasswordValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Id is Required!',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New Password is Required!',
        }),
    }),
});
exports.AuthValidation = {
    loginValidationZodSchema,
    changePasswordValidationZodSchema,
    refreshTokenValidationZodSchema,
    forgetPasswordValidationZodSchema,
    resetPasswordValidationZodSchema,
};
