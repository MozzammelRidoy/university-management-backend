"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academic_Semester_validation_zod_1 = require("./academic.Semester.validation.zod");
const academic_Semester_controller_1 = require("./academic.Semester.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), academic_Semester_controller_1.AcademicSemesterControllers.getAllSemester);
router.get('/:semesterId', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), academic_Semester_controller_1.AcademicSemesterControllers.getSingleSemester);
router.post('/create-academic-semester', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(academic_Semester_validation_zod_1.AcademicSemesterValidation.createAcademicSemesterValidationZodSchema), academic_Semester_controller_1.AcademicSemesterControllers.createAcademicSemester);
router.put('/update-academic-semester/:semesterId', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(academic_Semester_validation_zod_1.AcademicSemesterValidation.updateAcademicSemesterValidationZodSchema), academic_Semester_controller_1.AcademicSemesterControllers.updateAcademicSemester);
exports.AcademicSemesterRoutes = router;
