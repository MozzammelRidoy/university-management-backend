"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const enrolledCourse_validationZodSchema_1 = require("./enrolledCourse.validationZodSchema");
const enrolledCourse_controller_1 = require("./enrolledCourse.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-enrolled-course', (0, auth_1.default)('student'), (0, validateRequest_1.default)(enrolledCourse_validationZodSchema_1.EnrolledCourseValidation.createEnrolledCourseValidationZodSchema), enrolledCourse_controller_1.EnrolledCourseControllers.createEnrollCourse);
router.get('/my-enrolled-course', (0, auth_1.default)('student'), enrolledCourse_controller_1.EnrolledCourseControllers.getMyEnrolledCourses);
router.patch('/update-enrolled-course-marks', (0, auth_1.default)('superAdmin', 'admin', 'faculty'), (0, validateRequest_1.default)(enrolledCourse_validationZodSchema_1.EnrolledCourseValidation.updateEnrolledCourseMarksValidationZodSchema), enrolledCourse_controller_1.EnrolledCourseControllers.updateEnrolledCourseMarks);
exports.EnrolledCourseRoutes = router;
