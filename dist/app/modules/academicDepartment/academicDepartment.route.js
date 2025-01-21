"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const academicDepartment_controller_1 = require("./academicDepartment.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicDepartment_validationZodSchema_1 = require("./academicDepartment.validationZodSchema");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('admin', 'faculty', 'student'), academicDepartment_controller_1.AcademicDepartmentController.getAllAcademicDepartments);
router.get('/:departmentId', (0, auth_1.default)('admin', 'faculty', 'student'), academicDepartment_controller_1.AcademicDepartmentController.getSingleAcademicDepartment);
router.post('/create-academic-department', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(academicDepartment_validationZodSchema_1.AcademicDepartmentValidation.createAcademicDepartmentValidationZodSchema), academicDepartment_controller_1.AcademicDepartmentController.createAcademicDepartment);
router.patch('/:departmentId', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(academicDepartment_validationZodSchema_1.AcademicDepartmentValidation.updateAcademicDepartmentValidationZodSchema), academicDepartment_controller_1.AcademicDepartmentController.updateAcademicDepartment);
exports.AcademicDepartmentRoutes = router;
