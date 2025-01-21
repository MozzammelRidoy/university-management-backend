"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersControllers = void 0;
const users_service_1 = require("./users.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createStudent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, student: studentData } = req.body;
    const result = yield users_service_1.usersService.createStudentIntoBD(req.file, password, studentData, next);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Student is Created Successfully',
        data: result,
    });
}));
const createFaculty = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, faculty: facultyData } = req.body;
    const result = yield users_service_1.usersService.createFacultyIntoBD(req.file, password, facultyData, next);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faculty is Created Successfully',
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, admin: adminData } = req.body;
    const result = yield users_service_1.usersService.createAdminIntoDB(req.file, password, adminData, next);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin is Created Successfully',
        data: result,
    });
}));
// get me.
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const result = yield users_service_1.usersService.getMeFromDB(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User Retrived Successfully!',
        data: result,
    });
}));
const changeUserStataus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield users_service_1.usersService.changeUserStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User Status Changed Successfully!',
        data: result,
    });
}));
exports.usersControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeUserStataus,
};
