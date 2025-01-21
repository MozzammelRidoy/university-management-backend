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
exports.usersService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const academic_Semester_model_1 = require("../academicSemester/academic.Semester.model");
const user_utils_1 = require("./user.utils");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const faculty_Model_1 = require("../faculty/faculty.Model");
const students_model_1 = require("../student/students.model");
const users_model_1 = require("./users.model");
const admin_Model_1 = require("../admin/admin.Model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const createStudentIntoBD = (file, password, payload, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //create a user object
    //   const user: TNewUser = {}
    const userData = {};
    //if password is not given, use default password.
    userData.password = password || config_1.default.default_password;
    //set user role.
    userData.role = 'student';
    // set user email
    userData.email = payload.email;
    const addmissionSemester = yield academic_Semester_model_1.AcademicSemeter.findById(payload.addmissionSemester);
    if (!addmissionSemester) {
        throw new Error('Semester Not Found!');
    }
    //find department
    const academiDepartment = yield academicDepartment_model_1.AcademicDepartment.findById(payload.academicDepartment);
    if (!academiDepartment) {
        throw new AppError_1.default(404, 'Academic Department not found');
    }
    payload.academicFaculty = academiDepartment.academicFaculty;
    //set manually generated id
    const session = yield mongoose_1.default.startSession(); // session create
    try {
        session.startTransaction(); //transaction start
        userData.id = yield (0, user_utils_1.generatedStudentId)(addmissionSemester);
        if (file) {
            // call cloudinary .
            const imageName = `${userData === null || userData === void 0 ? void 0 : userData.id}_${(_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName}`;
            const path = file === null || file === void 0 ? void 0 : file.path;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinay)(imageName, path);
            payload.profileImage = secure_url;
        }
        const newUser = yield users_model_1.User.create([userData], { session }); // user create & (Transaction-1)
        if (!newUser.length) {
            throw new AppError_1.default(400, 'Failed to Create User'); //  ensuring User Created
        }
        payload.id = newUser[0].id; // set id in Student Data
        payload.user = newUser[0]._id; // set user Reference in Student
        const newStudent = yield students_model_1.Student.create([payload], { session }); // student create & (Transaction-2)
        if (!newStudent.length) {
            throw new AppError_1.default(400, 'Failed to Create Student'); // ensuring student Created
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newStudent;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        next(err);
        throw new AppError_1.default(400, 'Failed to Create Student');
    }
});
// faculty Create ====================
const createFacultyIntoBD = (file, password, payload, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userData = {};
    //if password is not given, use default password.
    userData.password = password || config_1.default.default_password;
    //set faculty role.
    userData.role = 'faculty';
    // set faculty email.
    userData.email = payload.email;
    //find academic Department
    const academicDepartment = yield academicDepartment_model_1.AcademicDepartment.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new AppError_1.default(404, 'Academic Department Not Found');
    }
    //set academic faculty
    payload.academicFaculty = academicDepartment === null || academicDepartment === void 0 ? void 0 : academicDepartment.academicFaculty;
    const session = yield mongoose_1.default.startSession(); // session created
    try {
        session.startTransaction(); // session started
        userData.id = yield (0, user_utils_1.generateFacultyId)();
        if (file) {
            // call cloudinary .
            const imageName = `${userData === null || userData === void 0 ? void 0 : userData.id}_${(_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName}`;
            const path = file === null || file === void 0 ? void 0 : file.path;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinay)(imageName, path);
            payload.profileImage = secure_url;
        }
        // user crearte (transaction-1)
        const newUser = yield users_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(400, 'Failed to Create Users');
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        // create faculty (transaction-2)
        const newFaculty = yield faculty_Model_1.Faculty.create([payload], { session });
        if (!newFaculty.length) {
            throw new AppError_1.default(400, 'Faield to Create Faculty');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newFaculty;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        next(err);
        throw new AppError_1.default(400, 'Failed to Create Faculty');
    }
});
// admin Create ==================
const createAdminIntoDB = (file, password, payload, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // create a user object
    const userData = {};
    //if password is not given , use deafult password
    userData.password = password || config_1.default.default_password;
    //set student role
    userData.role = 'admin';
    //set admin email
    userData.email = payload.email;
    const session = yield mongoose_1.default.startSession(); // session create.
    try {
        session.startTransaction();
        userData.id = yield (0, user_utils_1.generateAdminId)();
        if (file) {
            // call cloudinary .
            const imageName = `${userData === null || userData === void 0 ? void 0 : userData.id}_${(_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName}`;
            const path = file === null || file === void 0 ? void 0 : file.path;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinay)(imageName, path);
            payload.profileImage = secure_url;
        }
        // create a user (transaction-1)
        const newUser = yield users_model_1.User.create([userData], { session });
        //create a admin
        if (!newUser.length) {
            throw new AppError_1.default(400, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id
        // create a admin (transaction-2)
        const newAdmin = yield admin_Model_1.Admin.create([payload], { session });
        if (!newAdmin.length) {
            throw new AppError_1.default(400, 'Failed to create admin');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newAdmin;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        next(err);
        throw new AppError_1.default(400, 'Failed to create admin!');
    }
});
// getMe
const getMeFromDB = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'student') {
        result = yield students_model_1.Student.findOne({ id })
            .populate('user')
            .populate('addmissionSemester')
            .populate({
            path: 'academicDepartment',
            populate: { path: 'academicFaculty' },
        });
    }
    else if (role === 'admin') {
        result = yield admin_Model_1.Admin.findOne({ id }).populate('user');
    }
    else if (role === 'faculty') {
        result = yield faculty_Model_1.Faculty.findOne({ id }).populate('user academicDepartment academicFaculty');
    }
    return result;
});
const changeUserStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.usersService = {
    createStudentIntoBD,
    createFacultyIntoBD,
    createAdminIntoDB,
    getMeFromDB,
    changeUserStatus,
};
