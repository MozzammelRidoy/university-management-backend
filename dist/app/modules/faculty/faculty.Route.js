"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const faculty_Controler_1 = require("./faculty.Controler");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_ValidationZodSchema_1 = require("./faculty.ValidationZodSchema");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)('superAdmin', 'admin', 'faculty'), faculty_Controler_1.FacultyController.getSingleFaculty);
router.get('/', (0, auth_1.default)('superAdmin', 'admin', 'faculty'), faculty_Controler_1.FacultyController.getAllFaculties);
router.patch('/:id', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(faculty_ValidationZodSchema_1.FacultyValidationZodSchema.updateFacultyValidationZodSchema), faculty_Controler_1.FacultyController.updateFaculty);
router.delete('/:id', (0, auth_1.default)('superAdmin', 'admin'), faculty_Controler_1.FacultyController.deleteFaculty);
exports.FacultyRoutes = router;
