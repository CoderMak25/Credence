const Student = require('../models/Student');
const { calculateRisk } = require('../services/riskService');
const { aggregateMonthlyData } = require('../services/aggregationService');

/**
 * Get aggregated analytics data for institution-level insights
 */
exports.getAnalytics = async (req, res) => {
    try {
        const students = await Student.find();

        // Enrich all students with risk calculations
        const enrichedStudents = students.map(student => {
            const { aggregated, dataAvailability } = aggregateMonthlyData(student.weeklyData);
            const snapshot = {
                ...student.toObject(),
                ...aggregated
            };
            const riskAssessment = calculateRisk(snapshot, dataAvailability);
            return {
                ...snapshot,
                ...riskAssessment,
                dataAvailability
            };
        });

        // === SECTION 1: Institutional Health Overview ===
        const totalStudents = enrichedStudents.length;
        const highRiskCount = enrichedStudents.filter(s => s.riskLevel === 'high').length;
        const mediumRiskCount = enrichedStudents.filter(s => s.riskLevel === 'medium').length;
        const lowRiskCount = enrichedStudents.filter(s => s.riskLevel === 'low').length;

        const avgRiskScore = totalStudents > 0
            ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.riskScore, 0) / totalStudents)
            : 0;
        const avgConfidence = totalStudents > 0
            ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.confidence, 0) / totalStudents)
            : 0;

        const institutionalHealth = {
            totalStudents,
            riskDistribution: {
                high: { count: highRiskCount, percentage: Math.round((highRiskCount / totalStudents) * 100) || 0 },
                medium: { count: mediumRiskCount, percentage: Math.round((mediumRiskCount / totalStudents) * 100) || 0 },
                low: { count: lowRiskCount, percentage: Math.round((lowRiskCount / totalStudents) * 100) || 0 }
            },
            avgRiskScore,
            avgConfidence
        };

        // === SECTION 2: Risk Distribution by Department & Year ===
        const departmentStats = {};
        const yearStats = {};

        enrichedStudents.forEach(s => {
            // Department aggregation
            if (!departmentStats[s.department]) {
                departmentStats[s.department] = { total: 0, high: 0, medium: 0, low: 0 };
            }
            departmentStats[s.department].total++;
            departmentStats[s.department][s.riskLevel]++;

            // Year aggregation
            const yearKey = `Year ${s.year}`;
            if (!yearStats[yearKey]) {
                yearStats[yearKey] = { total: 0, high: 0, medium: 0, low: 0 };
            }
            yearStats[yearKey].total++;
            yearStats[yearKey][s.riskLevel]++;
        });

        const riskByDepartment = Object.entries(departmentStats).map(([name, stats]) => ({
            name,
            total: stats.total,
            highRisk: stats.high,
            highRiskPct: Math.round((stats.high / stats.total) * 100),
            mediumRisk: stats.medium,
            lowRisk: stats.low
        })).sort((a, b) => b.highRiskPct - a.highRiskPct);

        const riskByYear = Object.entries(yearStats).map(([name, stats]) => ({
            name,
            total: stats.total,
            highRisk: stats.high,
            highRiskPct: Math.round((stats.high / stats.total) * 100),
            mediumRisk: stats.medium,
            lowRisk: stats.low
        })).sort((a, b) => a.name.localeCompare(b.name));

        // === SECTION 3: Confidence & Data Quality ===
        const gradeA = enrichedStudents.filter(s => s.confidence >= 85).length;
        const gradeB = enrichedStudents.filter(s => s.confidence >= 70 && s.confidence < 85).length;
        const gradeC = enrichedStudents.filter(s => s.confidence >= 50 && s.confidence < 70).length;
        const gradeD = enrichedStudents.filter(s => s.confidence < 50).length;

        const missingAttendance = enrichedStudents.filter(s => s.attendanceRate === null).length;
        const missingQuiz = enrichedStudents.filter(s => s.quizAverage === null && s.dataAvailability?.hasQuizzes !== false).length;
        const missingAssignment = enrichedStudents.filter(s => s.assignmentCompletionRate === null && s.dataAvailability?.hasAssignments !== false).length;
        const missingLMS = enrichedStudents.filter(s => s.lmsLoginsPerWeek === null).length;

        const confidenceAnalytics = {
            gradeDistribution: {
                A: { count: gradeA, percentage: Math.round((gradeA / totalStudents) * 100) || 0 },
                B: { count: gradeB, percentage: Math.round((gradeB / totalStudents) * 100) || 0 },
                C: { count: gradeC, percentage: Math.round((gradeC / totalStudents) * 100) || 0 },
                D: { count: gradeD, percentage: Math.round((gradeD / totalStudents) * 100) || 0 }
            },
            lowConfidenceCount: gradeC + gradeD,
            missingDataFrequency: {
                attendance: { count: missingAttendance, percentage: Math.round((missingAttendance / totalStudents) * 100) || 0 },
                quiz: { count: missingQuiz, percentage: Math.round((missingQuiz / totalStudents) * 100) || 0 },
                assignment: { count: missingAssignment, percentage: Math.round((missingAssignment / totalStudents) * 100) || 0 },
                lms: { count: missingLMS, percentage: Math.round((missingLMS / totalStudents) * 100) || 0 }
            }
        };

        // === SECTION 4: Intervention Effectiveness (Simulated) ===
        // This is synthetic data for demonstration purposes
        const interventionStudents = enrichedStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');
        const interventionCount = Math.min(interventionStudents.length, Math.floor(totalStudents * 0.3));

        const interventionStats = {
            simulated: true, // Flag to indicate this is demo data
            totalInterventions: interventionCount,
            improved: Math.floor(interventionCount * 0.45),
            noChange: Math.floor(interventionCount * 0.35),
            pendingFollowUp: Math.ceil(interventionCount * 0.20)
        };

        res.json({
            institutionalHealth,
            riskByDepartment,
            riskByYear,
            confidenceAnalytics,
            interventionStats,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
};
