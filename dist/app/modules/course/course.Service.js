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
exports.CourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const course_Constant_1 = require("./course.Constant");
const course_Model_1 = require("./course.Model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_Model_1.Course.create(payload);
    return result;
});
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_Model_1.Course.findById(id).populate('preRequisiteCourses.course');
    return result;
});
const getAllCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(course_Model_1.Course.find().populate('preRequisiteCourses.course'), query)
        .search(course_Constant_1.courseSearchAbleFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield courseQuery.countTotal();
    const result = yield courseQuery.modelQuery;
    return { meta, result };
});
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = payload, courseRemainingData = __rest(payload, ["preRequisiteCourses"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //step : 1, Basic Course info update
        const udpateBasicCourseInfo = yield course_Model_1.Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });
        if (!udpateBasicCourseInfo) {
            throw new AppError_1.default(400, 'Failed to Course Update');
        }
        //   console.log(preRequisiteCourses)
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out the deleted field
            const deletedPreRequisites = preRequisiteCourses
                .filter(el => el.course && el.isDeleted)
                .map(el => el.course);
            const deletedPreRequisitesCourses = yield course_Model_1.Course.findByIdAndUpdate(id, {
                $pull: {
                    preRequisiteCourses: { course: { $in: deletedPreRequisites } },
                },
            }, {
                new: true,
                runValidators: true,
                session,
            });
            if (!deletedPreRequisitesCourses) {
                throw new AppError_1.default(400, 'Failed to Pre Requisite Update');
            }
            //filter out the new course filed
            const newPreRequisites = preRequisiteCourses.filter(el => el.course && !el.isDeleted);
            const newPreRequisitesCourses = yield course_Model_1.Course.findByIdAndUpdate(id, {
                $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
            }, {
                new: true,
                runValidators: true,
                session,
            });
            if (!newPreRequisitesCourses) {
                throw new AppError_1.default(400, 'Failed Pre Requisite Add');
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        const result = yield course_Model_1.Course.findById(id).populate('preRequisiteCourses.course');
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const deleteCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_Model_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
const assignFacultiesWithCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_Model_1.CourseFaculty.findByIdAndUpdate(id, {
        course: id,
        $addToSet: { faculties: { $each: payload } },
    }, { upsert: true, new: true });
    return result;
});
const getFacultiesWithCourseFromDB = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_Model_1.CourseFaculty.findOne({
        course: courseId,
    }).populate('faculties');
    return result;
});
const removeFacultiesFromCourseFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_Model_1.CourseFaculty.findByIdAndUpdate(id, {
        $pull: { faculties: { $in: payload } },
    }, { new: true });
    return result;
});
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    getFacultiesWithCourseFromDB,
    removeFacultiesFromCourseFromDB,
};
