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
exports.AcademicSemeter = void 0;
const mongoose_1 = require("mongoose");
const academic_Semester_constant_1 = require("./academic.Semester.constant");
const academicSemesterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        enum: academic_Semester_constant_1.AcademicSemeterName,
        required: true,
    },
    code: {
        type: String,
        enum: academic_Semester_constant_1.AcademicSemeterCode,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    startMonth: {
        type: String,
        enum: academic_Semester_constant_1.Months,
        required: true,
    },
    endMonth: {
        type: String,
        enum: academic_Semester_constant_1.Months,
        required: true,
    },
}, {
    timestamps: true,
});
academicSemesterSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isSemesterExists = yield exports.AcademicSemeter.findOne({
            year: this.year,
            name: this.name,
        });
        if (isSemesterExists) {
            throw new Error('Semester is Already exists!');
        }
        next();
    });
});
academicSemesterSchema.pre('updateOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateData = this.getUpdate();
        if (updateData && '$set' in updateData) {
            const { year, name } = updateData.$set || {};
            if (!year || !name)
                return next();
            const isSemesterExists = yield exports.AcademicSemeter.findOne({
                year,
                name,
            });
            if (isSemesterExists) {
                throw new Error('Semester is Already exists!');
            }
        }
        next();
    });
});
exports.AcademicSemeter = (0, mongoose_1.model)('AcademicSemester', academicSemesterSchema);
