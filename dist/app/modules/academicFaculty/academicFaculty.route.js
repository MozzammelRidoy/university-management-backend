"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_validationZodSchema_1 = require("./academicFaculty.validationZodSchema");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('admin', 'faculty', 'student'), academicFaculty_controller_1.AcademicFacultyController.getAllAcademicFaculties);
router.get('/:facultyId', (0, auth_1.default)('admin', 'faculty', 'student'), academicFaculty_controller_1.AcademicFacultyController.getSingleAcademicFaculty);
router.post('/create-academic-faculty', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(academicFaculty_validationZodSchema_1.AcademicFacultyValidation.createAcademicFacultyValidationZodSchema), academicFaculty_controller_1.AcademicFacultyController.createAcademicFaculty);
router.patch('/:facultyId', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(academicFaculty_validationZodSchema_1.AcademicFacultyValidation.updateAcademicFacultyValidationZodSchema), academicFaculty_controller_1.AcademicFacultyController.updateAcademicFaculty);
exports.AcademicFacultyRoutes = router;
