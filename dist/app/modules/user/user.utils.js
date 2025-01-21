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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminId = exports.findLastAdminId = exports.generateFacultyId = exports.findLastFacultyId = exports.generatedStudentId = void 0;
const users_model_1 = require("./users.model");
const findLastStudentId = (currentYearCode) => __awaiter(void 0, void 0, void 0, function* () {
    const laststudent = yield users_model_1.User.findOne({
        role: 'student',
        id: { $regex: `^${currentYearCode}` },
    }, {
        id: 1,
        _id: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    return (laststudent === null || laststudent === void 0 ? void 0 : laststudent.id) ? laststudent.id : undefined;
});
const generatedStudentId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString();
    const currentYearCode = `${payload.year}${payload.code}`;
    const laststudentId = yield findLastStudentId(currentYearCode);
    const lastStudentSemesterCode = laststudentId === null || laststudentId === void 0 ? void 0 : laststudentId.substring(4, 6); //01
    const lastStudentYear = laststudentId === null || laststudentId === void 0 ? void 0 : laststudentId.substring(0, 4); // 2030
    const currentSemesterCode = payload.code;
    const currentStudentYear = payload.year;
    if (laststudentId &&
        lastStudentSemesterCode === currentSemesterCode &&
        lastStudentYear === currentStudentYear) {
        currentId = laststudentId.substring(6);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
});
exports.generatedStudentId = generatedStudentId;
// Faculty ID
const findLastFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastFaculty = yield users_model_1.User.findOne({
        role: 'faculty',
    }, {
        id: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastFaculty === null || lastFaculty === void 0 ? void 0 : lastFaculty.id) ? lastFaculty.id : undefined;
});
exports.findLastFacultyId = findLastFacultyId;
const generateFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString();
    const lastFacultyId = yield (0, exports.findLastFacultyId)();
    if (lastFacultyId) {
        currentId = lastFacultyId.substring(2);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `F-${incrementId}`;
    return incrementId;
});
exports.generateFacultyId = generateFacultyId;
// Admin ID
const findLastAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdmin = yield users_model_1.User.findOne({
        role: 'admin',
    }, {
        id: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastAdmin === null || lastAdmin === void 0 ? void 0 : lastAdmin.id) ? lastAdmin.id : undefined;
});
exports.findLastAdminId = findLastAdminId;
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString();
    const lastFacultyId = yield (0, exports.findLastAdminId)();
    if (lastFacultyId) {
        currentId = lastFacultyId.substring(2);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `A-${incrementId}`;
    return incrementId;
});
exports.generateAdminId = generateAdminId;
