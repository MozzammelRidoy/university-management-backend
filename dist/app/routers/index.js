"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academic_Semester_route_1 = require("../modules/academicSemester/academic.Semester.route");
const academicFaculty_route_1 = require("../modules/academicFaculty/academicFaculty.route");
const academicDepartment_route_1 = require("../modules/academicDepartment/academicDepartment.route");
const users_route_1 = require("../modules/user/users.route");
const students_route_1 = require("../modules/student/students.route");
const faculty_Route_1 = require("../modules/faculty/faculty.Route");
const admin_route_1 = require("../modules/admin/admin.route");
const course_route_1 = require("../modules/course/course.route");
const semesterRegistration_route_1 = require("./../modules/semesterRegistration/semesterRegistration.route");
const offeredCourses_route_1 = require("../modules/offeredCoures/offeredCourses.route");
const auth_route_1 = require("../modules/auth/auth.route");
const enrolledCourse_route_1 = require("../modules/enrolledCourse/enrolledCourse.route");
const routers = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: users_route_1.UserRoutes,
    },
    {
        path: '/students',
        route: students_route_1.StudentRoutes,
    },
    {
        path: '/faculties',
        route: faculty_Route_1.FacultyRoutes,
    },
    {
        path: '/admins',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/academic-semester',
        route: academic_Semester_route_1.AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: academicFaculty_route_1.AcademicFacultyRoutes,
    },
    {
        path: '/academic-departments',
        route: academicDepartment_route_1.AcademicDepartmentRoutes,
    },
    {
        path: '/courses',
        route: course_route_1.CourseRoutes,
    },
    {
        path: '/semester-registrations',
        route: semesterRegistration_route_1.SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: offeredCourses_route_1.OfferedCourseRoutes,
    },
    {
        path: '/enrolled-courses',
        route: enrolledCourse_route_1.EnrolledCourseRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach(router => routers.use(router.path, router.route));
exports.default = routers;
