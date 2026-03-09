/**
 * Aggregation Service
 * Computes monthly aggregated values from weekly raw data
 */

/**
 * Aggregate weekly data into monthly snapshot fields
 * @param {Array} weeklyData - Array of weekly records
 * @returns {Object} Aggregated monthly values + data availability metadata
 */
function aggregateMonthlyData(weeklyData) {
    if (!weeklyData || weeklyData.length === 0) {
        return {
            aggregated: {
                attendanceRate: null,
                assignmentCompletionRate: null,
                quizAverage: null,
                lmsLoginsPerWeek: null,
                lateSubmissionsCount: null
            },
            dataAvailability: {
                attendanceWeeks: 0,
                quizWeeks: 0,
                assignmentWeeks: 0,
                totalWeeks: 0
            }
        };
    }

    // Attendance: Average of weekly percentages, converted to 0-1 scale
    const attendanceValues = weeklyData
        .filter(w => w.attendancePercentage != null)
        .map(w => w.attendancePercentage);

    const attendanceRate = attendanceValues.length > 0
        ? (attendanceValues.reduce((sum, v) => sum + v, 0) / attendanceValues.length) / 100
        : null;

    // Assignments: Total submitted / Total given
    const totalAssignmentsGiven = weeklyData.reduce((sum, w) => sum + (w.assignmentsGiven || 0), 0);
    const totalAssignmentsSubmitted = weeklyData.reduce((sum, w) => sum + (w.assignmentsSubmitted || 0), 0);

    const assignmentCompletionRate = totalAssignmentsGiven > 0
        ? totalAssignmentsSubmitted / totalAssignmentsGiven
        : null; // No assignments given = null, not 0

    // Quiz: Average of scores where quiz was conducted
    const quizScores = weeklyData
        .filter(w => w.quizConducted && w.quizScore != null)
        .map(w => w.quizScore);

    const quizAverage = quizScores.length > 0
        ? quizScores.reduce((sum, v) => sum + v, 0) / quizScores.length
        : null;

    // LMS Logins: Average per week
    const lmsLogins = weeklyData
        .filter(w => w.lmsLogins != null)
        .map(w => w.lmsLogins);

    const lmsLoginsPerWeek = lmsLogins.length > 0
        ? lmsLogins.reduce((sum, v) => sum + v, 0) / lmsLogins.length
        : null;

    // Late Submissions: Sum across all weeks
    const lateSubmissionsCount = weeklyData.reduce((sum, w) => sum + (w.lateSubmissions || 0), 0);

    // Data availability metadata for confidence calculation
    const dataAvailability = {
        attendanceWeeks: attendanceValues.length,
        quizWeeks: quizScores.length,
        assignmentWeeks: weeklyData.filter(w => w.assignmentsGiven > 0).length,
        totalWeeks: weeklyData.length,
        hasAssignments: totalAssignmentsGiven > 0,
        hasQuizzes: quizScores.length > 0
    };

    return {
        aggregated: {
            attendanceRate,
            assignmentCompletionRate,
            quizAverage,
            lmsLoginsPerWeek,
            lateSubmissionsCount
        },
        dataAvailability
    };
}

module.exports = { aggregateMonthlyData };
