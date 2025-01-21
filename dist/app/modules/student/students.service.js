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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const students_model_1 = require("./students.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const students_constant_1 = require("./students.constant");
const users_model_1 = require("../user/users.model");
const getAllStudentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const studentQuery = new QueryBuilder_1.default(students_model_1.Student.find()
        .populate('user')
        .populate('addmissionSemester')
        .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
    }), query)
        .search(students_constant_1.studentSearchableFileds)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield studentQuery.countTotal();
    const result = yield studentQuery.modelQuery;
    return { meta, result };
});
const getSingleStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield students_model_1.Student.findById(id).populate('user addmissionSemester academicDepartment academicFaculty');
    return result;
});
const updateSingleStudentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, guardian, localGuardian } = payload, remainingStudentData = __rest(payload, ["name", "guardian", "localGuardian"]);
    const modifiedUpdateData = Object.assign({}, remainingStudentData);
    /*
        {
          "name" : {
              "lastName" : "set"
          },
          "guardian.fatherOccupation" : "Teacher"
        }
  
        -> name.firstName = 'Abc'
        -> name.lastName = 'Xyz'
    */
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdateData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdateData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdateData[`localGuardian.${key}`] = value;
        }
    }
    const result = yield students_model_1.Student.findByIdAndUpdate(id, modifiedUpdateData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield students_model_1.Student.isStudentExists(id))) {
        throw new AppError_1.default(400, 'This Student Dose not Existis!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedStudent = yield students_model_1.Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new AppError_1.default(400, 'Failed to Delete Student');
        }
        const userId = deletedStudent.user;
        const deletedUser = yield users_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError_1.default(400, 'Failed to Delete User');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedStudent;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(400, 'Student Deleting Feiled!');
    }
});
exports.StudentService = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateSingleStudentFromDB: updateSingleStudentIntoDB,
    deleteStudentFromDB,
};
