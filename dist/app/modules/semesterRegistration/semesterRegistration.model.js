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
exports.SemesterRegistration = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
const SemesterRegistrationSchema = new mongoose_1.default.Schema({
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Academic Semester is required'],
        unique: true,
        ref: 'AcademicSemester',
    },
    status: {
        type: String,
        enum: semesterRegistration_constant_1.SemesterRagistrationStatus,
        default: 'UPCOMING',
        required: [true, 'Semester Ragistration Status is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End Date is required'],
    },
    minCredit: {
        type: Number,
        required: [true, 'Min Credit is required al least 3'],
        default: 3,
    },
    maxCredit: {
        type: Number,
        required: [true, 'Max Credit is required'],
        default: 15,
    },
}, {
    timestamps: true,
});
exports.SemesterRegistration = mongoose_1.default.model('SemesterRegistration', SemesterRegistrationSchema);
