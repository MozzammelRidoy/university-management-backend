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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const academic_Semester_model_1 = require("../academicSemester/academic.Semester.model");
const students_model_1 = require("../students/students.model");
const user_utils_1 = require("./user.utils");
const users_model_1 = require("./users.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createStudentIntoBD = (password, payload, next) => __awaiter(void 0, void 0, void 0, function* () {
    //create a user object
    //   const user: TNewUser = {}
    const userData = {};
    //if password is not given, use default password.
    userData.password = password || config_1.default.default_password;
    //set user role.
    userData.role = 'student';
    const addmissionSemester = yield academic_Semester_model_1.AcademicSemeter.findById(payload.addmissionSemester);
    if (!addmissionSemester) {
        throw new Error('Semester Not Found!');
    }
    //set manually generated id
    userData.id = yield (0, user_utils_1.generatedStudentId)(addmissionSemester);
    // create a user
    // const newUser = await User.create(userData)
    // // create a student
    // if (Object.keys(newUser).length) {
    //   //set id, _id as user.
    //   payload.id = newUser.id
    //   payload.user = newUser._id
    //   const newStudent = await Student.create(payload)
    //   return newStudent
    // }
    const session = yield mongoose_1.default.startSession(); // session create
    try {
        session.startTransaction(); //transaction start
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
        throw new AppError_1.default(400, 'Failed To Create Student');
    }
});
exports.usersService = {
    createStudentIntoBD,
};
