const Student = require('../models/Student');
const { calculateRisk } = require('../services/riskService');

/**
 * Get all students with risk assessments
 */
exports.getStudentsWithRisk = async (req, res) => {
    try {
        const students = await Student.find().sort({ lastUpdated: -1 });

        const enrichedStudents = students.map(student => {
            const riskAssessment = calculateRisk(student);
            return {
                _id: student._id,
                studentId: student.studentId,
                name: student.name,
                department: student.department,
                year: student.year,
                attendanceRate: student.attendanceRate,
                assignmentCompletionRate: student.assignmentCompletionRate,
                quizAverage: student.quizAverage,
                lmsLoginsPerWeek: student.lmsLoginsPerWeek,
                lateSubmissionsCount: student.lateSubmissionsCount,
                lastUpdated: student.lastUpdated,
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

        const riskAssessment = calculateRisk(student);

        res.json({
            ...student.toObject(),
            ...riskAssessment
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student data' });
    }
};
