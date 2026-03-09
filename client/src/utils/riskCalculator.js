/**
 * Risk scoring utility for demo mode (client-side recalculation)
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

export function calculateRisk(student) {
    const missingFields = [];
    const factors = [];
    let riskScore = 0;
    let confidence = 100;

    // Attendance Rate
    if (student.attendanceRate != null) {
        const attendancePenalty = (1 - student.attendanceRate) * FIELD_WEIGHTS.attendanceRate * 4;
        riskScore += attendancePenalty;

        const impact = student.attendanceRate < 0.7 ? 'high' : student.attendanceRate < 0.85 ? 'medium' : 'low';
        factors.push({
            field: 'attendanceRate',
            label: 'Attendance',
            impact,
            description: student.attendanceRate < 0.7 ? 'Attendance is critically low' :
                student.attendanceRate < 0.85 ? 'Attendance remains acceptable but sporadic' : 'Attendance is good',
            value: `${Math.round(student.attendanceRate * 100)}%`,
            average: '88%'
        });
    } else {
        missingFields.push('attendanceRate');
        confidence -= CONFIDENCE_PENALTIES.attendanceRate;
    }

    // Assignment Completion Rate
    if (student.assignmentCompletionRate != null) {
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
        const quizPenalty = ((100 - student.quizAverage) / 100) * FIELD_WEIGHTS.quizAverage * 4;
        riskScore += quizPenalty;

        const impact = student.quizAverage < 50 ? 'high' : student.quizAverage < 70 ? 'medium' : 'low';
        factors.push({
            field: 'quizAverage',
            label: 'Quiz Performance',
            impact,
            description: student.quizAverage < 50 ? 'Quiz scores are critically low' :
                student.quizAverage < 70 ? 'Recent quiz scores show downward trend' : 'Quiz performance is satisfactory',
            value: `${Math.round(student.quizAverage)}/100`,
            trend: student.quizAverage < 70 ? '-12%' : '+5%'
        });
    } else {
        missingFields.push('quizAverage');
        confidence -= CONFIDENCE_PENALTIES.quizAverage;
    }

    // LMS Logins
    if (student.lmsLoginsPerWeek != null) {
        const lmsPenalty = student.lmsLoginsPerWeek < 3 ? FIELD_WEIGHTS.lmsLoginsPerWeek * 3 :
            student.lmsLoginsPerWeek < 5 ? FIELD_WEIGHTS.lmsLoginsPerWeek * 1.5 : 0;
        riskScore += lmsPenalty;

        factors.push({
            field: 'lmsLoginsPerWeek',
            label: 'Peer Interaction',
            impact: student.lmsLoginsPerWeek < 3 ? 'medium' : 'low',
            description: student.lmsLoginsPerWeek < 3 ? 'Forum participation data is low' : 'Active on platform',
            value: `${student.lmsLoginsPerWeek} logins/week`
        });
    } else {
        missingFields.push('lmsLoginsPerWeek');
        confidence -= CONFIDENCE_PENALTIES.lmsLoginsPerWeek;
        factors.push({
            field: 'lmsLoginsPerWeek',
            label: 'Peer Interaction',
            impact: 'none',
            description: 'Forum participation data is missing.',
            value: 'null'
        });
    }

    // Late Submissions
    if (student.lateSubmissionsCount != null) {
        const latePenalty = Math.min(student.lateSubmissionsCount * 8, FIELD_WEIGHTS.lateSubmissionsCount * 4);
        riskScore += latePenalty;
    } else {
        missingFields.push('lateSubmissionsCount');
        confidence -= CONFIDENCE_PENALTIES.lateSubmissionsCount;
    }

    riskScore = Math.min(100, Math.max(0, riskScore));
    confidence = Math.max(0, confidence);

    let riskLevel = riskScore >= 65 ? 'high' : riskScore >= 35 ? 'medium' : 'low';
    let dataQuality = confidence >= 85 ? 'excellent' : confidence >= 70 ? 'good' : confidence >= 50 ? 'fair' : 'poor';
    let dataQualityGrade = dataQuality === 'excellent' ? 'A' : dataQuality === 'good' ? 'B' : dataQuality === 'fair' ? 'C+' : 'D';

    let recommendation;
    if (riskLevel === 'high' && confidence >= 50) {
        recommendation = `Model predicts a ${Math.min(95, Math.round(riskScore + 20))}% probability of failure without intervention. Recommend scheduling office hours within 48 hours.`;
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
        dataQualityGrade,
        missingFields,
        factors,
        recommendation
    };
}
