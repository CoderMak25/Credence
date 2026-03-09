import { useState } from 'react';

export default function ConfidenceTooltip({ missingFields, dataQuality }) {
    const [isOpen, setIsOpen] = useState(false);

    const fieldLabels = {
        attendanceRate: 'Attendance Rate',
        assignmentCompletionRate: 'Assignment Completion',
        quizAverage: 'Quiz Scores',
        lmsLoginsPerWeek: 'LMS Activity Logs',
        lateSubmissionsCount: 'Late Submission Records'
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="text-slate-400 hover:text-blue-500 transition-colors"
            >
                <iconify-icon icon="solar:question-circle-linear" width="16"></iconify-icon>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-4">
                    <div className="flex items-start gap-2 mb-3">
                        <iconify-icon icon="solar:info-circle-linear" class="text-blue-500 mt-0.5" width="18"></iconify-icon>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Understanding Confidence</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Confidence reflects data completeness and reliability, <strong>not</strong> probability of failure.
                            </p>
                        </div>
                    </div>

                    {missingFields && missingFields.length > 0 && (
                        <div className="mb-3">
                            <h5 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">Missing Data</h5>
                            <ul className="space-y-1">
                                {missingFields.map((field, index) => (
                                    <li key={index} className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                                        <iconify-icon icon="solar:close-circle-linear" width="14"></iconify-icon>
                                        {fieldLabels[field] || field}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Data Quality</span>
                            <span className={`font-medium ${dataQuality === 'excellent' ? 'text-emerald-600 dark:text-emerald-400' :
                                    dataQuality === 'good' ? 'text-blue-600 dark:text-blue-400' :
                                        dataQuality === 'fair' ? 'text-amber-600 dark:text-amber-400' :
                                            'text-red-600 dark:text-red-400'
                                }`}>
                                {dataQuality?.charAt(0).toUpperCase() + dataQuality?.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
