const mongoose = require('mongoose');

// Weekly record sub-schema
const weeklyRecordSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    attendancePercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    assignmentsGiven: {
        type: Number,
        min: 0,
        default: 0
    },
    assignmentsSubmitted: {
        type: Number,
        min: 0,
        default: 0
    },
    quizConducted: {
        type: Boolean,
        default: false
    },
    quizScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    lateSubmissions: {
        type: Number,
        min: 0,
        default: 0
    },
    lmsLogins: {
        type: Number,
        min: 0,
        default: 0
    }
}, { _id: false });

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
    // Weekly raw data (4 weeks per month)
    weeklyData: {
        type: [weeklyRecordSchema],
        default: []
    },
    // Aggregated monthly values (computed from weeklyData)
    // These are populated by the aggregation service for compatibility
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
