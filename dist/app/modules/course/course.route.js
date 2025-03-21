"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_ValidationZodSchema_1 = require("./course.ValidationZodSchema");
const course_Controller_1 = require("./course.Controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-course', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_ValidationZodSchema_1.CourseValidationZodSchema.createCourseValidationZodSchema), course_Controller_1.CoruseControllers.createCourse);
router.get('/', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), course_Controller_1.CoruseControllers.getAllCourses);
router.get('/:id', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), course_Controller_1.CoruseControllers.getSingleCourse);
router.patch('/:id', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_ValidationZodSchema_1.CourseValidationZodSchema.updateCourseValidationZodSchema), course_Controller_1.CoruseControllers.updateCourse);
router.delete('/:id', (0, auth_1.default)('superAdmin', 'admin'), course_Controller_1.CoruseControllers.deleteCourse);
router.put('/:courseId/assign-faculties', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_ValidationZodSchema_1.CourseValidationZodSchema.facultiesWithCourseValidationZodSchema), course_Controller_1.CoruseControllers.assignFacultiesWithCourse);
router.get('/:courseId/get-faculties', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), course_Controller_1.CoruseControllers.getFacultiesWithCourse);
router.delete('/:courseId/remove-faculties', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_ValidationZodSchema_1.CourseValidationZodSchema.facultiesWithCourseValidationZodSchema), course_Controller_1.CoruseControllers.removeFacultiesFromCourse);
exports.CourseRoutes = router;
