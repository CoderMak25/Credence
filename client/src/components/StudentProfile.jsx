import { useState } from 'react';
import ContactModal from './ContactModal';
import { AttendanceChart, QuizChart, LMSChart, AssignmentChart } from './TimelineCharts';

/**
 * StudentProfile - Comprehensive decision-support view
 * Displays student data in 7 structured sections for advisors
 */
export default function StudentProfile({ student, onClose }) {
    const [showContactModal, setShowContactModal] = useState(false);

    if (!student) return null;

    // Calculate data coverage sentence
    const getDataCoverageSentence = () => {
        const da = student.dataAvailability || {};
        const parts = [];
        if (da.attendanceWeeks) parts.push(`${da.attendanceWeeks} weeks of attendance`);
        if (da.quizWeeks) parts.push(`${da.quizWeeks} weeks of quiz data`);
        if (da.totalWeeks) parts.push(`LMS activity`);
        return parts.length > 0
            ? `This assessment is based on ${parts.join(', ')}.`
            : 'Limited data available for this assessment.';
    };

    // Get urgency level
    const getUrgency = () => {
        if (student.riskLevel === 'high' && student.confidence >= 70) return 'immediate';
        if (student.riskLevel === 'high') return 'proactive';
        if (student.riskLevel === 'medium') return 'monitor';
        return 'none';
    };

    const urgency = getUrgency();

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
                >
                    <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
                </button>

                <div className="overflow-y-auto custom-scroll flex-1">

                    {/* SECTION 1: Student Context Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                    {student.name}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                                    {student.studentId} • {student.department} • Year {student.year}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                    📅 Data observed: last 4 weeks
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* Risk Badge - Visually louder */}
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${student.riskLevel === 'high'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800'
                                    : student.riskLevel === 'medium'
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800'
                                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800'
                                    }`}>
                                    {student.riskLevel?.toUpperCase()} RISK
                                </span>
                                {/* Confidence Badge - Muted */}
                                <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    Grade {student.dataQualityGrade}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Risk & Confidence Summary */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <iconify-icon icon="solar:shield-check-linear"></iconify-icon>
                            Risk & Confidence Summary
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Risk Score</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{student.riskScore}<span className="text-lg text-slate-400">/100</span></p>
                                <p className={`text-sm font-medium mt-1 ${student.riskLevel === 'high' ? 'text-red-600 dark:text-red-400' :
                                    student.riskLevel === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                                        'text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                    {student.riskLevel === 'high' ? '⚠️ High Risk' :
                                        student.riskLevel === 'medium' ? '⚡ Medium Risk' : '✓ Low Risk'}
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Confidence</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{student.confidence}<span className="text-lg text-slate-400">%</span></p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {student.confidence >= 85 ? 'Excellent data quality' :
                                        student.confidence >= 70 ? 'Good data quality' :
                                            student.confidence >= 50 ? 'Fair data quality' : 'Poor data quality'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic">
                            {getDataCoverageSentence()}
                        </p>
                    </div>

                    {/* SECTION 3: Academic Health Timeline */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <iconify-icon icon="solar:graph-up-linear"></iconify-icon>
                            Academic Health Timeline
                            <span className="text-[10px] text-slate-400 font-normal ml-2">Last 4 weeks • Dashed line = monthly average</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <AttendanceChart
                                weeklyData={student.weeklyData}
                                monthlyAverage={student.attendanceRate}
                            />
                            <QuizChart
                                weeklyData={student.weeklyData}
                                monthlyAverage={student.quizAverage}
                            />
                            <LMSChart
                                weeklyData={student.weeklyData}
                                monthlyAverage={student.lmsLoginsPerWeek}
                            />
                            <AssignmentChart
                                weeklyData={student.weeklyData}
                                monthlyRate={student.assignmentCompletionRate}
                            />
                        </div>
                    </div>

                    {/* SECTION 4: Signal-Wise Breakdown */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <iconify-icon icon="solar:tuning-2-linear"></iconify-icon>
                            Signal-Wise Breakdown
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {student.factors?.map((factor, i) => (
                                <SignalCard key={i} factor={factor} weeklyData={student.weeklyData} />
                            ))}
                        </div>
                    </div>

                    {/* SECTION 5: System Analytics Snapshot */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <iconify-icon icon="solar:cpu-bolt-linear"></iconify-icon>
                            System Reasoning
                        </h2>
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                {student.riskLevel === 'high' ? (
                                    <>Risk is primarily driven by <strong>{student.factors?.filter(f => f.impact === 'high').map(f => f.label.toLowerCase()).join(' and ') || 'multiple concerning signals'}</strong>.</>
                                ) : student.riskLevel === 'medium' ? (
                                    <>Some concerns noted in <strong>{student.factors?.filter(f => f.impact === 'medium').map(f => f.label.toLowerCase()).join(' and ') || 'academic signals'}</strong>.</>
                                ) : (
                                    <>Student shows <strong>stable performance</strong> across all monitored signals.</>
                                )}
                            </p>
                            {student.missingFields?.length > 0 && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                                    <iconify-icon icon="solar:danger-triangle-linear"></iconify-icon>
                                    Missing data: {student.missingFields.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* SECTION 6: Recommendations */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <iconify-icon icon="solar:lightbulb-linear"></iconify-icon>
                            Recommendation
                        </h2>
                        <div className={`rounded-xl p-4 border ${urgency === 'immediate' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' :
                            urgency === 'proactive' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' :
                                'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${urgency === 'immediate' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                    urgency === 'proactive' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}>
                                    {urgency === 'immediate' ? 'Immediate' : urgency === 'proactive' ? 'Proactive' : 'Monitor'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                                {student.recommendation}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                                ⚠️ Recommendations are advisory and should be validated by the advisor.
                            </p>
                        </div>
                    </div>

                </div>

                {/* SECTION 7: Action Buttons - BOTTOM */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Contact Student
                    </button>
                </div>

            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <ContactModal
                    student={student}
                    urgency={urgency}
                    onClose={() => setShowContactModal(false)}
                />
            )}
        </div>
    );
}

// Signal Card Component
function SignalCard({ factor, weeklyData }) {
    const getDataCoverage = () => {
        if (!weeklyData) return '0/4 weeks';
        const field = factor.field;
        if (field === 'quizAverage') {
            const quizWeeks = weeklyData.filter(w => w.quizConducted).length;
            return `${quizWeeks}/4 weeks`;
        }
        return '4/4 weeks';
    };

    return (
        <div className={`rounded-lg p-3 border ${factor.impact === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' :
            factor.impact === 'medium' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' :
                'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
            }`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{factor.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${factor.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                    factor.impact === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                        factor.impact === 'none' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400' :
                            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    }`}>
                    {factor.impact === 'none' ? 'NO DATA' : factor.impact?.toUpperCase()}
                </span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{factor.value}</p>
            <p className="text-[10px] text-slate-400">{getDataCoverage()}</p>
        </div>
    );
}
