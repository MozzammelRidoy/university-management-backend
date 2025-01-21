"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const students_controller_1 = require("./students.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const students_validation_zod_1 = require("./students.validation.zod");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('superAdmin', 'admin', 'faculty'), students_controller_1.studentControllers.getAllStudent);
router.get('/:id', (0, auth_1.default)('superAdmin', 'admin', 'faculty'), students_controller_1.studentControllers.getSingleStudent);
router.patch('/:id', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(students_validation_zod_1.StudentValidationZodSchema.updateStudentValidationZodSchema), students_controller_1.studentControllers.updateStudent);
router.delete('/delete/:id', (0, auth_1.default)('superAdmin', 'admin'), students_controller_1.studentControllers.deleteSingleStudent);
exports.StudentRoutes = router;
