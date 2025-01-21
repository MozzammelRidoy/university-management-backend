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
exports.AcademicSemesterService = void 0;
const academic_Semester_constant_1 = require("./academic.Semester.constant");
const academic_Semester_model_1 = require("./academic.Semester.model");
const getAllSemesterFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academic_Semester_model_1.AcademicSemeter.find();
    return result;
});
const getSingleSemesterFromDB = (semesterId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academic_Semester_model_1.AcademicSemeter.findById({ _id: semesterId });
    return result;
});
const createAcademicSemesterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (academic_Semester_constant_1.academicSemesterNameAndCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code!');
    }
    const result = yield academic_Semester_model_1.AcademicSemeter.create(payload);
    return result;
});
const updateSingleAcademicSemesterIntoDB = (semesterId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.name &&
        payload.code &&
        academic_Semester_constant_1.academicSemesterNameAndCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code');
    }
    const result = yield academic_Semester_model_1.AcademicSemeter.findOneAndUpdate({ _id: semesterId }, payload, {
        new: true,
    });
    return result;
});
exports.AcademicSemesterService = {
    getAllSemesterFromDB,
    getSingleSemesterFromDB,
    createAcademicSemesterIntoDB,
    updateSingleAcademicSemesterIntoDB,
};
