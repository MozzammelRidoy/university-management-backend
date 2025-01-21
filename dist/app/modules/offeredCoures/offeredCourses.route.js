"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const offeredCourses_validationZodSchema_1 = require("./offeredCourses.validationZodSchema");
const offeredCoures_controller_1 = require("./offeredCoures.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-offered-course', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(offeredCourses_validationZodSchema_1.OfferedCourseValidation.createOfferedCourseValidationZodSchema), offeredCoures_controller_1.OfferedCourseControllers.createOfferedCourse);
router.get('/', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), offeredCoures_controller_1.OfferedCourseControllers.getAllOfferedCourses);
router.get('/my-offered-courses', (0, auth_1.default)('student'), offeredCoures_controller_1.OfferedCourseControllers.getMyOfferedCourses);
router.get('/:id', (0, auth_1.default)('superAdmin', 'admin', 'faculty', 'student'), offeredCoures_controller_1.OfferedCourseControllers.getSingleOfferedCourse);
router.patch('/:id', (0, auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(offeredCourses_validationZodSchema_1.OfferedCourseValidation.updateOfferedCourseValidationZodSchema), offeredCoures_controller_1.OfferedCourseControllers.updateOfferedCourse);
exports.OfferedCourseRoutes = router;
