"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const semesterRegistration_validationZodSchema_1 = require("./semesterRegistration.validationZodSchema");
const semesterRegistration_controller_1 = require("./semesterRegistration.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-semester-registration', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(semesterRegistration_validationZodSchema_1.SemesterRegistrationValidation.createSemesterRegistrationValidationZodSchema), semesterRegistration_controller_1.SemesterRagistrationControllers.createSemesterRegistration);
router.get('/', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), semesterRegistration_controller_1.SemesterRagistrationControllers.getAllSemesterRegistrations);
router.get('/:id', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), semesterRegistration_controller_1.SemesterRagistrationControllers.getSingleSemesterRegistration);
router.patch('/:id', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(semesterRegistration_validationZodSchema_1.SemesterRegistrationValidation.updateSemesterRegistrationValidationZodSchema), semesterRegistration_controller_1.SemesterRagistrationControllers.updateSemesterRegistration);
router.delete('/:id', (0, auth_1.default)('superAdmin', 'admin'), semesterRegistration_controller_1.SemesterRagistrationControllers.deleteSemesterRegistration);
exports.SemesterRegistrationRoutes = router;
