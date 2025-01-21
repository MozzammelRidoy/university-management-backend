"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const students_validation_zod_1 = require("../students/students.validation.zod");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post('/create-student', (0, validateRequest_1.default)(students_validation_zod_1.StudentValidationZodSchema.createStudentValidationZodSchema), users_controller_1.usersControllers.createStudent);
exports.UserRoutes = router;
