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
exports.Faculty = void 0;
const mongoose_1 = require("mongoose");
const faculty_Constant_1 = require("./faculty.Constant");
const FacultyNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    _id: false,
});
const FacultySchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'user must be required'],
        unique: true,
        ref: 'User',
    },
    degisnation: {
        type: String,
        required: [true, 'Designation is required'],
        trim: true,
    },
    name: {
        type: FacultyNameSchema,
        required: [true, 'Name is requried'],
    },
    gender: {
        type: String,
        enum: {
            values: faculty_Constant_1.Gender,
            message: '{VALUE} is not Valid',
        },
        required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    bloodGroup: {
        type: String,
        enum: {
            values: faculty_Constant_1.BloodGroup,
            message: '{VALUE} is not a valid blood group',
        },
        trim: true,
    },
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
    profileImage: { type: String, default: '' },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Acadcemic Department is required'],
        ref: 'AcademicDepartment',
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Acadcemic Faculty is required'],
        ref: 'AcademicFaculty',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// generating full name
FacultySchema.virtual('fullName').get(function () {
    var _a, _b, _c;
    return `${(_a = this === null || this === void 0 ? void 0 : this.name) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = this === null || this === void 0 ? void 0 : this.name) === null || _b === void 0 ? void 0 : _b.middleName} ${(_c = this === null || this === void 0 ? void 0 : this.name) === null || _c === void 0 ? void 0 : _c.lastName}`;
});
// filter out deleted documents
FacultySchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
FacultySchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
FacultySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
//checking if user is already exist!
FacultySchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.Faculty.findOne({ id });
        return existingUser;
    });
};
exports.Faculty = (0, mongoose_1.model)('Faculty', FacultySchema);
