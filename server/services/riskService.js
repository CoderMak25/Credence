/**
 * Risk Scoring Service
 * Computes risk score and confidence based on student data
 */

const FIELD_WEIGHTS = {
    attendanceRate: 15,
    assignmentCompletionRate: 25,
    quizAverage: 25,
    lmsLoginsPerWeek: 15,
    lateSubmissionsCount: 20
};

const CONFIDENCE_PENALTIES = {
    attendanceRate: 20,
    assignmentCompletionRate: 25,
    quizAverage: 20,
    lmsLoginsPerWeek: 15,
    lateSubmissionsCount: 10
};

/**
 * Calculate risk score and confidence for a student
 * @param {Object} student - Student document
 * @returns {Object} Risk assessment result
 */
function calculateRisk(student) {
    const missingFields = [];
    const factors = [];
    let riskScore = 0;
    let confidence = 100;
    let availableWeight = 0;
    let totalWeight = 0;

    // Check data staleness (>14 days old)
    const daysSinceUpdate = Math.floor((Date.now() - new Date(student.lastUpdated)) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate > 14) {
        confidence -= Math.min(30, daysSinceUpdate - 14);
        factors.push({
            field: 'dataFreshness',
            label: 'Data Freshness',
            impact: 'low',
            description: `Data is ${daysSinceUpdate} days old`,
            value: `${daysSinceUpdate} days`
        });
    }

    // Attendance Rate
    if (student.attendanceRate != null) {
        availableWeight += FIELD_WEIGHTS.attendanceRate;
        const attendancePenalty = (1 - student.attendanceRate) * FIELD_WEIGHTS.attendanceRate * 4;
        riskScore += attendancePenalty;

        const impact = student.attendanceRate < 0.7 ? 'high' : student.attendanceRate < 0.85 ? 'medium' : 'low';
        factors.push({
            field: 'attendanceRate',
            label: 'Attendance',
            impact,
            description: student.attendanceRate < 0.7 ? 'Attendance is critically low' :
                student.attendanceRate < 0.85 ? 'Attendance is below average' : 'Attendance is acceptable',
            value: `${Math.round(student.attendanceRate * 100)}%`,
            average: '88%'
        });
    } else {
        missingFields.push('attendanceRate');
        confidence -= CONFIDENCE_PENALTIES.attendanceRate;
    }

    // Assignment Completion Rate
    if (student.assignmentCompletionRate != null) {
        availableWeight += FIELD_WEIGHTS.assignmentCompletionRate;
        const assignmentPenalty = (1 - student.assignmentCompletionRate) * FIELD_WEIGHTS.assignmentCompletionRate * 4;
        riskScore += assignmentPenalty;

        const impact = student.assignmentCompletionRate < 0.5 ? 'high' : student.assignmentCompletionRate < 0.75 ? 'medium' : 'low';
        factors.push({
            field: 'assignmentCompletionRate',
            label: 'Assignment Submission',
            impact,
            description: student.assignmentCompletionRate < 0.5 ? 'Rate of on-time submissions has dropped significantly' :
                student.assignmentCompletionRate < 0.75 ? 'Assignment completion is below target' : 'Assignment submissions are on track',
            value: `${Math.round(student.assignmentCompletionRate * 100)}%`,
            average: '88%'
        });
    } else {
        missingFields.push('assignmentCompletionRate');
        confidence -= CONFIDENCE_PENALTIES.assignmentCompletionRate;
    }

    // Quiz Average
    if (student.quizAverage != null) {
        availableWeight += FIELD_WEIGHTS.quizAverage;
        const quizPenalty = ((100 - student.quizAverage) / 100) * FIELD_WEIGHTS.quizAverage * 4;
        riskScore += quizPenalty;

        const impact = student.quizAverage < 50 ? 'high' : student.quizAverage < 70 ? 'medium' : 'low';
        factors.push({
            field: 'quizAverage',
            label: 'Quiz Performance',
            impact,
            description: student.quizAverage < 50 ? 'Quiz scores are failing' :
                student.quizAverage < 70 ? 'Recent quiz scores show downward trend' : 'Quiz performance is satisfactory',
            value: `${Math.round(student.quizAverage)}/100`,
            trend: student.quizAverage < 70 ? '-12%' : '+5%'
        });
    } else {
        missingFields.push('quizAverage');
        confidence -= CONFIDENCE_PENALTIES.quizAverage;
    }

    // LMS Logins Per Week
    if (student.lmsLoginsPerWeek != null) {
        availableWeight += FIELD_WEIGHTS.lmsLoginsPerWeek;
        const lmsPenalty = student.lmsLoginsPerWeek < 3 ? FIELD_WEIGHTS.lmsLoginsPerWeek * 3 :
            student.lmsLoginsPerWeek < 5 ? FIELD_WEIGHTS.lmsLoginsPerWeek * 1.5 : 0;
        riskScore += lmsPenalty;

        const impact = student.lmsLoginsPerWeek < 3 ? 'medium' : 'low';
        factors.push({
            field: 'lmsLoginsPerWeek',
            label: 'LMS Activity',
            impact,
            description: student.lmsLoginsPerWeek < 3 ? 'Very low platform engagement' :
                student.lmsLoginsPerWeek < 5 ? 'Below average platform usage' : 'Active on learning platform',
            value: `${student.lmsLoginsPerWeek} logins/week`
        });
    } else {
        missingFields.push('lmsLoginsPerWeek');
        confidence -= CONFIDENCE_PENALTIES.lmsLoginsPerWeek;
    }

    // Late Submissions Count
    if (student.lateSubmissionsCount != null) {
        availableWeight += FIELD_WEIGHTS.lateSubmissionsCount;
        const latePenalty = Math.min(student.lateSubmissionsCount * 8, FIELD_WEIGHTS.lateSubmissionsCount * 4);
        riskScore += latePenalty;

        const impact = student.lateSubmissionsCount > 5 ? 'high' : student.lateSubmissionsCount > 2 ? 'medium' : 'low';
        factors.push({
            field: 'lateSubmissionsCount',
            label: 'Late Submissions',
            impact,
            description: student.lateSubmissionsCount > 5 ? 'Frequent late submissions detected' :
                student.lateSubmissionsCount > 2 ? 'Some late submissions noted' : 'Submissions are timely',
            value: `${student.lateSubmissionsCount} late`
        });
    } else {
        missingFields.push('lateSubmissionsCount');
        confidence -= CONFIDENCE_PENALTIES.lateSubmissionsCount;
    }

    // Normalize risk score to 0-100
    riskScore = Math.min(100, Math.max(0, riskScore));
    confidence = Math.max(0, confidence);

    // Determine risk level
    let riskLevel;
    if (riskScore >= 65) {
        riskLevel = 'high';
    } else if (riskScore >= 35) {
        riskLevel = 'medium';
    } else {
        riskLevel = 'low';
    }

    // Determine data quality
    let dataQuality;
    if (confidence >= 85) {
        dataQuality = 'excellent';
    } else if (confidence >= 70) {
        dataQuality = 'good';
    } else if (confidence >= 50) {
        dataQuality = 'fair';
    } else {
        dataQuality = 'poor';
    }

    // Generate recommendation
    let recommendation;
    if (riskLevel === 'high' && confidence >= 50) {
        recommendation = `Model predicts a ${Math.min(95, riskScore + 20)}% probability of failure without intervention. Recommend scheduling office hours within 48 hours.`;
    } else if (riskLevel === 'high' && confidence < 50) {
        recommendation = 'Risk appears high but confidence is low due to missing data. Recommend collecting additional data before intervention.';
    } else if (riskLevel === 'medium') {
        recommendation = 'Student shows moderate risk factors. Consider proactive check-in and resource sharing.';
    } else {
        recommendation = 'Student appears to be on track. Continue regular monitoring.';
    }

    return {
        riskScore: Math.round(riskScore),
        riskLevel,
        confidence: Math.round(confidence),
        dataQuality,
        dataQualityGrade: dataQuality === 'excellent' ? 'A' : dataQuality === 'good' ? 'B' : dataQuality === 'fair' ? 'C+' : 'D',
        missingFields,
        factors,
        recommendation,
        daysSinceUpdate
    };
}

module.exports = { calculateRisk };
