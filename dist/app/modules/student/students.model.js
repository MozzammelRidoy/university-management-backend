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
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const UserNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is Required'],
        maxlength: [20, 'First Name Can not be More Than 20 characters.'],
        trim: true,
    },
    middleName: { type: String, trim: true },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required'],
        maxlength: [20, 'Last Name Can not be More Than 20 characters.'],
        trim: true,
    },
}, {
    _id: false,
});
const GuardianSchema = new mongoose_1.Schema({
    fatherName: {
        type: String,
        required: [true, 'Father Name is Required'],
        trim: true,
    },
    fatherOccupation: {
        type: String,
        required: [true, 'Father Occupation is Required'],
        trim: true,
    },
    fatherContactNo: {
        type: String,
        required: [true, 'Father Contact Number is Required'],
        trim: true,
    },
    motherName: {
        type: String,
        required: [true, 'Mother Name is Required'],
        trim: true,
    },
    motherOccupation: {
        type: String,
        required: [true, 'Mother Occupation is Required'],
        trim: true,
    },
    motherContactNo: {
        type: String,
        required: [true, 'Mother Contact No is Required'],
        trim: true,
    },
}, {
    _id: false,
});
const LocalGuardianSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Local Guardian Name is Required'],
        trim: true,
    },
    occupation: {
        type: String,
        required: [true, 'Local G Occupation is Required'],
        trim: true,
    },
    contactNo: {
        type: String,
        required: [true, 'Local G Contact No is Required'],
        trim: true,
    },
}, {
    _id: false,
});
const studentSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'user must be is required'],
        unique: true,
        ref: 'User',
    },
    name: {
        type: UserNameSchema,
        required: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not Valid',
        },
        required: true,
        trim: true,
    },
    dateOfBirth: { type: String, trim: true },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        trim: true,
    },
    contactNo: {
        type: String,
        required: [true, 'Contact Number is Required'],
        trim: true,
    },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency Contact Number is Required'],
        trim: true,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
        trim: true,
    },
    presentAddress: {
        type: String,
        required: [true, 'Pressent Address is Required'],
        trim: true,
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent Address is Required'],
        trim: true,
    },
    guardian: { type: GuardianSchema, required: true },
    localGuardian: { type: LocalGuardianSchema, required: true },
    profileImage: { type: String, default: '' },
    addmissionSemester: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
        ref: 'AcademicSemester',
    },
    academicDepartment: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
        ref: 'AcademicDepartment',
    },
    academicFaculty: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
        ref: 'AcademicFaculty',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// query middleware
studentSchema.pre('find', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ isDeleted: { $ne: true } });
        next();
    });
});
studentSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
studentSchema.statics.isStudentExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingStudent = yield exports.Student.findOne({ id });
        return existingStudent;
    });
};
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
