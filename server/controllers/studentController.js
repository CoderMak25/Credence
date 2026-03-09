const Student = require('../models/Student');
const { calculateRisk } = require('../services/riskService');
const { aggregateMonthlyData } = require('../services/aggregationService');

/**
 * Get all students with risk assessments
 */
exports.getStudentsWithRisk = async (req, res) => {
    try {
        const students = await Student.find().sort({ lastUpdated: -1 });

        const enrichedStudents = students.map(student => {
            // Aggregate weekly data into monthly snapshot
            const { aggregated, dataAvailability } = aggregateMonthlyData(student.weeklyData);

            // Create snapshot object with aggregated values
            const snapshot = {
                ...student.toObject(),
                attendanceRate: aggregated.attendanceRate,
                assignmentCompletionRate: aggregated.assignmentCompletionRate,
                quizAverage: aggregated.quizAverage,
                lmsLoginsPerWeek: aggregated.lmsLoginsPerWeek,
                lateSubmissionsCount: aggregated.lateSubmissionsCount
            };

            // Calculate risk using aggregated snapshot + data availability
            const riskAssessment = calculateRisk(snapshot, dataAvailability);

            return {
                _id: student._id,
                studentId: student.studentId,
                name: student.name,
                department: student.department,
                year: student.year,
                attendanceRate: aggregated.attendanceRate,
                assignmentCompletionRate: aggregated.assignmentCompletionRate,
                quizAverage: aggregated.quizAverage,
                lmsLoginsPerWeek: aggregated.lmsLoginsPerWeek,
                lateSubmissionsCount: aggregated.lateSubmissionsCount,
                lastUpdated: student.lastUpdated,
                weeklyData: student.weeklyData,
                dataAvailability,
                ...riskAssessment
            };
        });

        // Calculate summary stats
        const totalStudents = enrichedStudents.length;
        const highRiskStudents = enrichedStudents.filter(s => s.riskLevel === 'high').length;
        const lowConfidenceCount = enrichedStudents.filter(s => s.confidence < 60).length;
        const needsIntervention = enrichedStudents.filter(s => s.riskLevel === 'high' && s.confidence >= 50).length;

        res.json({
            students: enrichedStudents,
            summary: {
                totalStudents,
                highRiskStudents,
                lowConfidenceCount,
                needsIntervention
            }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch student data' });
    }
};

/**
 * Get a single student by ID
 */
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.id });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Aggregate weekly data into monthly snapshot
        const { aggregated, dataAvailability } = aggregateMonthlyData(student.weeklyData);

        const snapshot = {
            ...student.toObject(),
            attendanceRate: aggregated.attendanceRate,
            assignmentCompletionRate: aggregated.assignmentCompletionRate,
            quizAverage: aggregated.quizAverage,
            lmsLoginsPerWeek: aggregated.lmsLoginsPerWeek,
            lateSubmissionsCount: aggregated.lateSubmissionsCount
        };

        const riskAssessment = calculateRisk(snapshot, dataAvailability);

        res.json({
            ...snapshot,
            dataAvailability,
            ...riskAssessment
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student data' });
    }
};
