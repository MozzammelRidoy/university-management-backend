"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validationZodSchema_1 = require("./auth.validationZodSchema");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidation.loginValidationZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/change-password', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidation.changePasswordValidationZodSchema), auth_controller_1.AuthController.changePassword);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidation.refreshTokenValidationZodSchema), auth_controller_1.AuthController.refreshToken);
router.post('/forget-password', (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidation.forgetPasswordValidationZodSchema), auth_controller_1.AuthController.forgetPassword);
router.post('/reset-password', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidation.resetPasswordValidationZodSchema), auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
