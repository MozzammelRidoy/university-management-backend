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
exports.EnrolledCourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const offeredCourses_model_1 = require("../offeredCoures/offeredCourses.model");
const students_model_1 = require("../student/students.model");
const enrolledCourse_model_1 = require("./enrolledCourse.model");
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const course_Model_1 = require("../course/course.Model");
const faculty_Model_1 = require("../faculty/faculty.Model");
const enrolledCourse_utils_1 = require("./enrolledCourse.utils");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createEnrolledCourseIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Step1 : Check if the offerd courses is exists.
     * Step2 : Check if the student is already enrolled.
     * Step3 : Check if the max credits exceed.
     * Step4 : Create and Enrolled coruse.
     */
    const { offeredCourse } = payload;
    const isOfferedCourseExists = yield offeredCourses_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(404, 'Offered Course Not Found!');
    }
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError_1.default(400, 'Room is Full!');
    }
    const student = yield students_model_1.Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new AppError_1.default(404, 'Student Not Found!');
    }
    const isStudentAlreadyEnrolled = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists === null || isOfferedCourseExists === void 0 ? void 0 : isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: student === null || student === void 0 ? void 0 : student._id,
    });
    if (isStudentAlreadyEnrolled) {
        throw new AppError_1.default(400, 'Student is Already Enrolled!');
    }
    // check total credits exceeds maxCredits.
    const semesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit');
    const maxCredits = semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit;
    // total enrolled credit + new enrolled course credit > maxCredit
    const enrolledCourses = yield enrolledCourse_model_1.EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData',
            },
        },
        {
            $unwind: '$enrolledCourseData',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCretids: { $sum: '$enrolledCourseData.credits' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCretids: 1,
            },
        },
    ]);
    const course = yield course_Model_1.Course.findById(isOfferedCourseExists.course).select('credits');
    const currentCredits = course === null || course === void 0 ? void 0 : course.credits;
    const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCretids : 0;
    if (totalCredits &&
        maxCredits &&
        totalCredits + currentCredits > maxCredits) {
        throw new AppError_1.default(400, 'You have exceeded maximum number of credits!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const result = yield enrolledCourse_model_1.EnrolledCourse.create([
            {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                academicSemester: isOfferedCourseExists.academicSemester,
                academicFaculty: isOfferedCourseExists.academicFaculty,
                academicDepartment: isOfferedCourseExists.academicDepartment,
                offeredCourse,
                course: isOfferedCourseExists.course,
                student: student._id,
                faculty: isOfferedCourseExists.faculty,
                isEnrolled: true,
            },
        ], { session });
        if (!result) {
            throw new AppError_1.default(400, 'Failed to Enroll in this course!');
        }
        const maxCapacity = isOfferedCourseExists.maxCapacity;
        yield offeredCourses_model_1.OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1,
        }, { session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getMyEnrolledCoursesFromDB = (studentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield students_model_1.Student.findOne({ id: studentId });
    if (!student) {
        throw new AppError_1.default(404, 'Student not found!');
    }
    const enrolledCourseQuery = new QueryBuilder_1.default(enrolledCourse_model_1.EnrolledCourse.find({ student: student._id }).populate('semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield enrolledCourseQuery.modelQuery;
    const meta = yield enrolledCourseQuery.countTotal();
    return {
        meta,
        result,
    };
});
const updateEnrolledCourseMarksIntoDB = (facultyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
    const isSemesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistration) {
        throw new AppError_1.default(404, 'Semester Registration not Found!');
    }
    const isOfferedCourseExists = yield offeredCourses_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(404, 'Offered Course is Not Found!');
    }
    const isStudentExists = yield students_model_1.Student.findById(student);
    if (!isStudentExists) {
        throw new AppError_1.default(404, 'Student is not found!');
    }
    const faculty = yield faculty_Model_1.Faculty.findOne({ id: facultyId }, { _id: 1 });
    const isCourseBelongToFaculty = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty === null || faculty === void 0 ? void 0 : faculty._id,
    });
    if (!isCourseBelongToFaculty) {
        throw new AppError_1.default(403, 'You are Forbidden!');
    }
    const modifiedData = Object.assign({}, courseMarks);
    if (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } = isCourseBelongToFaculty.courseMarks;
        const totalMarks = 
        // Math.ceil(classTest1 * 0.1) +
        // Math.ceil(midTerm * 0.3) +
        // Math.ceil(classTest2 * 0.1) +
        // Math.ceil(finalTerm * 0.5)
        Math.ceil(classTest1) +
            Math.ceil(midTerm) +
            Math.ceil(classTest2) +
            Math.ceil(finalTerm);
        const result = (0, enrolledCourse_utils_1.calculateGradeAndPoints)(totalMarks);
        modifiedData.grade = result.grade;
        modifiedData.gradePoints = result.gradePoints;
        modifiedData.isCompleted = true;
    }
    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }
    const result = yield enrolledCourse_model_1.EnrolledCourse.findByIdAndUpdate(isCourseBelongToFaculty._id, modifiedData, {
        new: true,
    });
    return result;
});
exports.EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getMyEnrolledCoursesFromDB,
    updateEnrolledCourseMarksIntoDB,
};
