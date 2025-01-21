"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const students_validation_zod_1 = require("../student/students.validation.zod");
const faculty_ValidationZodSchema_1 = require("../faculty/faculty.ValidationZodSchema");
const admin_ValidationZodSchema_1 = require("../admin/admin.ValidationZodSchema");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const users_validation_zod_1 = require("./users.validation.zod");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post('/create-student', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(students_validation_zod_1.StudentValidationZodSchema.createStudentValidationZodSchema), users_controller_1.usersControllers.createStudent);
router.post('/create-faculty', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(faculty_ValidationZodSchema_1.FacultyValidationZodSchema.createFacultyValidationZodSchema), users_controller_1.usersControllers.createFaculty);
router.post('/create-admin', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(admin_ValidationZodSchema_1.AdminValidationsZodSchema.createAdminValidationSchema), users_controller_1.usersControllers.createAdmin);
router.get('/me', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), users_controller_1.usersControllers.getMe);
router.post('/change-status/:id', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(users_validation_zod_1.userValidation.changeUserStatusValidationZodSchema), users_controller_1.usersControllers.changeUserStataus);
exports.UserRoutes = router;
