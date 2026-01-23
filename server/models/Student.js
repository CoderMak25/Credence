const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    // Academic signals - all nullable for incomplete data support
    attendanceRate: {
        type: Number,
        min: 0,
        max: 1,
        default: null
    },
    assignmentCompletionRate: {
        type: Number,
        min: 0,
        max: 1,
        default: null
    },
    quizAverage: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    lmsLoginsPerWeek: {
        type: Number,
        default: null
    },
    lateSubmissionsCount: {
        type: Number,
        default: null
    },
    // Metadata
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
