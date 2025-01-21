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
exports.OfferedCourseServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const academicFaculty_model_1 = require("../academicFaculty/academicFaculty.model");
const course_Model_1 = require("../course/course.Model");
const faculty_Model_1 = require("../faculty/faculty.Model");
const semesterRegistration_constant_1 = require("../semesterRegistration/semesterRegistration.constant");
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const students_model_1 = require("../student/students.model");
const offeredCourse_utils_1 = require("./offeredCourse.utils");
const offeredCourses_model_1 = require("./offeredCourses.model");
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime, } = payload;
    //check if the semester registration id is exists.
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default(404, 'Semester Registration not found!');
    }
    const academicSemester = isSemesterRegistrationExists.academicSemester;
    //check if the academicFaculty id is exists.
    const isAcademicFacultyExists = yield academicFaculty_model_1.AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError_1.default(404, 'Academic Faculty not found!');
    }
    //check if the academicDepartment id is exists.
    const isAcademicDepartmentExists = yield academicDepartment_model_1.AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError_1.default(404, 'Academic Department not found!');
    }
    //check if the Course id is exists.
    const isCourseExists = yield course_Model_1.Course.findById(course);
    if (!isCourseExists) {
        throw new AppError_1.default(404, 'Course not found!');
    }
    //check if the Course id is exists.
    const isFacultyExists = yield faculty_Model_1.Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(404, 'Faculty not found!');
    }
    //check if the department is belong to the faculty.
    const isDepartmentBelongToFaculty = yield academicDepartment_model_1.AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError_1.default(404, `This ${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}!`);
    }
    // check if the same offered course same section in same registration semester is already exists.
    const isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = yield offeredCourses_model_1.OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });
    if (isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError_1.default(400, `Offered Course with same section is already exists.`);
    }
    // get the schedule of the faculties.
    const assingedSchedule = yield offeredCourses_model_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');
    const newSchedule = { days, startTime, endTime };
    if ((0, offeredCourse_utils_1.hasTimeConflict)(assingedSchedule, newSchedule)) {
        throw new AppError_1.default(400, `This Faculty is not available at this time! Choose other time or days`);
    }
    //finally create offered course.
    const result = yield offeredCourses_model_1.OfferedCourse.create(Object.assign(Object.assign({}, payload), { academicSemester }));
    return result;
});
const getAllOfferedCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourseQuery = new QueryBuilder_1.default(offeredCourses_model_1.OfferedCourse.find().populate('semesterRegistration academicSemester academicFaculty academicDepartment course faculty'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield offeredCourseQuery.modelQuery;
    const meta = yield offeredCourseQuery.countTotal();
    return { meta, result };
});
const getMyOfferedCoursesFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination setup.
    const page = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query === null || query === void 0 ? void 0 : query.limit) || 10;
    const skip = (page - 1) * limit;
    // find the student.
    const student = yield students_model_1.Student.findOne({ id: userId });
    if (!student) {
        throw new AppError_1.default(404, 'User is not found!');
    }
    //find the ongoing semester.
    const currentOngoingSemesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findOne({
        status: 'ONGOING',
    });
    if (!currentOngoingSemesterRegistration) {
        throw new AppError_1.default(404, 'There is no ongoing semester registration!');
    }
    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingSemesterRegistration._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingSemesterRegistration: currentOngoingSemesterRegistration._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingSemesterRegistration',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFullFiled: {
                    $or: [
                        {
                            $eq: ['$course.preRequisiteCourses', []],
                        },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFullFiled: true,
            },
        },
    ];
    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];
    const result = yield offeredCourses_model_1.OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ]);
    const totalData = (yield offeredCourses_model_1.OfferedCourse.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(totalData / limit);
    return {
        meta: {
            page,
            limit,
            totalData,
            totalPage,
        },
        result,
    };
});
const getSingleOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourses_model_1.OfferedCourse.findById(id);
    return result;
});
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { faculty, days, startTime, endTime } = payload;
    //check if the offered course id is exists.
    const isOfferedCourseExists = yield offeredCourses_model_1.OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(404, 'Offered Course not found!');
    }
    // check if the semester registration is Upcoming.
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration).select('status');
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== semesterRegistration_constant_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(400, `You can not update this offered course as it is ${semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status} `);
    }
    // check if the faculty is exists.
    const isFacultyExists = yield faculty_Model_1.Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(404, 'Faculty not found!');
    }
    // get the schedule of the faculties.
    const assingedSchedule = yield offeredCourses_model_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');
    const newSchedule = { days, startTime, endTime };
    if ((0, offeredCourse_utils_1.hasTimeConflict)(assingedSchedule, newSchedule)) {
        throw new AppError_1.default(400, `This Faculty is not available at this time! Choose other time or days`);
    }
    //finally update the offered course.
    const result = yield offeredCourses_model_1.OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getMyOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
};
