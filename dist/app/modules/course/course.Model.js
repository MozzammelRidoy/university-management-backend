"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFaculty = exports.Course = void 0;
const mongoose_1 = require("mongoose");
const PreRequisiteCoursesSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    _id: false,
});
const CourseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Title is required'],
    },
    prefix: {
        type: String,
        trim: true,
        required: [true, 'Prfix is required'],
    },
    code: {
        type: Number,
        trim: true,
        required: [true, 'Code is required'],
    },
    credits: {
        type: Number,
        trim: true,
        required: [true, 'Credits is required'],
    },
    preRequisiteCourses: [PreRequisiteCoursesSchema],
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
exports.Course = (0, mongoose_1.model)('Course', CourseSchema);
const courseFacultySchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
    },
    faculties: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Faculty',
        },
    ],
});
exports.CourseFaculty = (0, mongoose_1.model)('CourseFaculty', courseFacultySchema);
