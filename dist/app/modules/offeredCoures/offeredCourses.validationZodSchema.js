"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseValidation = void 0;
const zod_1 = require("zod");
const offeredCourses_constant_1 = require("./offeredCourses.constant");
const timeStringSchema = zod_1.z.string().refine(time => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
}, {
    message: 'Invalid time format, expected "HH:MM in 24 hours format',
});
const createOfferedCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        semesterRegistration: zod_1.z.string(),
        academicFaculty: zod_1.z.string(),
        academicDepartment: zod_1.z.string(),
        course: zod_1.z.string(),
        faculty: zod_1.z.string(),
        maxCapacity: zod_1.z.number(),
        section: zod_1.z.number(),
        days: zod_1.z.array(zod_1.z.enum([...offeredCourses_constant_1.Days])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    })
        .refine(body => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
    }, {
        message: 'Start time should be before End time',
    }),
});
const updateOfferedCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        faculty: zod_1.z.string(),
        maxCapacity: zod_1.z.number(),
        days: zod_1.z.array(zod_1.z.enum([...offeredCourses_constant_1.Days])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    })
        .refine(body => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
    }, {
        message: 'Start time should be before End time',
    }),
});
exports.OfferedCourseValidation = {
    createOfferedCourseValidationZodSchema,
    updateOfferedCourseValidationZodSchema,
};
