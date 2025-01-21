"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourse = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const offeredCourses_constant_1 = require("./offeredCourses.constant");
const OfferedCourseSchema = new mongoose_1.default.Schema({
    semesterRegistration: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Semester Registration is required'],
        ref: 'SemesterRegistration',
    },
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Academic Semester is required'],
        ref: 'AcademicSemester',
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Academic Faculty is required'],
        ref: 'AcademicFaculty',
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Academic Department is required'],
        ref: 'AcademicDepartment',
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Course is required'],
        ref: 'Course',
    },
    faculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Faculty is required'],
        ref: 'Faculty',
    },
    maxCapacity: {
        type: Number,
        required: [true, 'Max Capacity is required'],
    },
    section: {
        type: Number,
        required: [true, 'Section is required'],
    },
    days: [
        {
            type: String,
            enum: offeredCourses_constant_1.Days,
        },
    ],
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
    },
}, {
    timestamps: true,
});
exports.OfferedCourse = mongoose_1.default.model('OfferedCourse', OfferedCourseSchema);
