"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTimeConflict = void 0;
const hasTimeConflict = (assingedSchedule, newSchedule) => {
    for (const schedule of assingedSchedule) {
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}:00`);
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}:00`);
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00`);
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true;
        }
    }
    return false;
};
exports.hasTimeConflict = hasTimeConflict;
