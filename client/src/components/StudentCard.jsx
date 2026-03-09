export default function StudentCard({ student, isSelected, onClick }) {
    const getRiskBadgeClasses = (riskLevel) => {
        switch (riskLevel) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
            case 'medium':
                return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
            default:
                return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
        }
    };

    const getRiskLabel = (riskLevel) => {
        switch (riskLevel) {
            case 'high': return 'HIGH RISK';
            case 'medium': return 'MED RISK';
            default: return 'LOW RISK';
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence < 40) return 'bg-red-400';
        if (confidence < 70) return 'bg-amber-400';
        return 'bg-blue-500';
    };

    const getConfidenceTextColor = (confidence) => {
        if (confidence < 40) return 'text-red-600 dark:text-red-400 font-medium';
        if (confidence < 70) return 'text-amber-600 dark:text-amber-400 font-medium';
        return 'text-slate-500 dark:text-slate-400';
    };

    if (isSelected) {
        return (
            <div
                onClick={onClick}
                className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 shadow-sm cursor-pointer relative group transition-all"
            >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-base">{student.name}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {student.studentId}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getRiskBadgeClasses(student.riskLevel)}`}>
                            {getRiskLabel(student.riskLevel)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getConfidenceColor(student.confidence)}`}
                                style={{ width: `${student.confidence}%` }}
                            ></div>
                        </div>
                        <span className={`text-[10px] ${getConfidenceTextColor(student.confidence)}`}>{student.confidence}% Conf.</span>
                    </div>
                    <iconify-icon icon="solar:alt-arrow-right-linear" class="text-blue-400"></iconify-icon>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-700 cursor-pointer transition-all group"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-medium text-slate-700 dark:text-slate-300 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{student.name}</h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">ID: {student.studentId}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getRiskBadgeClasses(student.riskLevel)}`}>
                    {getRiskLabel(student.riskLevel)}
                </span>
            </div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getConfidenceColor(student.confidence)}`}
                            style={{ width: `${student.confidence}%` }}
                        ></div>
                    </div>
                    <span className={`text-[10px] ${getConfidenceTextColor(student.confidence)}`}>{student.confidence}% Conf.</span>
                </div>
                {student.confidence < 40 && (
                    <iconify-icon icon="solar:danger-triangle-linear" class="text-red-400 text-xs"></iconify-icon>
                )}
            </div>
        </div>
    );
}
