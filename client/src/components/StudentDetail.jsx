import ConfidenceTooltip from './ConfidenceTooltip';

export default function StudentDetail({ student }) {
    if (!student) {
        return (
            <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm items-center justify-center transition-colors">
                <iconify-icon icon="solar:user-rounded-linear" class="text-slate-300 dark:text-slate-700" width="64"></iconify-icon>
                <p className="text-slate-400 dark:text-slate-500 mt-4">Select a student to view details</p>
            </div>
        );
    }

    const getImpactBadge = (impact) => {
        switch (impact) {
            case 'high':
                return <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">HIGH IMPACT</span>;
            case 'medium':
                return <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">MED IMPACT</span>;
            case 'low':
                return <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">LOW IMPACT</span>;
            default:
                return <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">NO DATA</span>;
        }
    };

    return (
        <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-y-auto custom-scroll transition-colors">
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{student.name}</h2>
                        {student.riskLevel === 'high' && (
                            <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-xs px-2 py-1 rounded font-medium">At Risk</span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">ID: {student.studentId} • {student.department} Year {student.year}</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">View Profile</button>
                    <button className="px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-colors">Contact Student</button>
                </div>
            </div>

            <div className="p-6 space-y-8">

                {/* Recommendation Alert */}
                {student.riskLevel === 'high' && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex gap-4">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-full border border-red-100 dark:border-red-900/30 h-fit text-red-500">
                            <iconify-icon icon="solar:bell-bing-bold" width="20"></iconify-icon>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Immediate Intervention Recommended</h4>
                            <p className="text-sm text-red-700 dark:text-red-300/80 leading-relaxed">
                                {student.recommendation}
                            </p>
                        </div>
                    </div>
                )}

                {/* Data Quality Warning Section */}
                {student.dataQuality !== 'excellent' && (
                    <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-dashed border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <iconify-icon icon="solar:shield-warning-linear" class="text-amber-500"></iconify-icon>
                            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Data Quality Warning: {student.dataQuality.charAt(0).toUpperCase() + student.dataQuality.slice(1)}</h4>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <p className="text-xs text-amber-700 dark:text-amber-400/80 max-w-md">
                                Prediction confidence is reduced due to missing {student.missingFields?.join(', ') || 'data'}. The risk score may be {student.riskLevel === 'high' ? 'inflated' : 'affected'}.
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Data Grade:</span>
                                <span className="text-xs font-mono font-bold bg-white dark:bg-slate-900 px-2 py-1 rounded border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400">
                                    {student.dataQuality?.toUpperCase()} ({student.dataQualityGrade})
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confidence Vis */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Model Confidence Assessment</h3>
                            <ConfidenceTooltip missingFields={student.missingFields} dataQuality={student.dataQuality} />
                        </div>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{student.confidence}% Certainty</span>
                    </div>
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden relative w-full">
                        {/* Background lines */}
                        <div className="absolute inset-0 flex justify-between px-2">
                            <div className="w-px h-full bg-white/50 dark:bg-slate-700/50"></div>
                            <div className="w-px h-full bg-white/50 dark:bg-slate-700/50"></div>
                            <div className="w-px h-full bg-white/50 dark:bg-slate-700/50"></div>
                        </div>
                        {/* Progress */}
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-r-md relative group transition-all duration-500"
                            style={{ width: `${student.confidence}%` }}
                        >
                            <div className="absolute inset-y-0 right-0 w-1 bg-white/30"></div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
                        <span>Guesswork</span>
                        <span>Informed</span>
                        <span>High Certainty</span>
                    </div>
                </div>

                {/* Risk Factors Grid */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Contributing Risk Factors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {student.factors?.slice(0, 4).map((factor, index) => (
                            <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                {factor.impact === 'none' && (
                                    <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10">
                                        <iconify-icon icon="solar:graph-up-bold" width="80"></iconify-icon>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{factor.label}</span>
                                    {getImpactBadge(factor.impact)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{factor.description}</p>
                                <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 px-2 py-1.5 font-mono text-xs text-slate-800 dark:text-slate-200">
                                    Value: <span className={
                                        factor.impact === 'high' ? 'text-red-600 dark:text-red-400' :
                                            factor.impact === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                                                factor.impact === 'none' ? 'text-slate-400 italic' :
                                                    'text-slate-900 dark:text-white'
                                    }>
                                        {factor.value}
                                    </span>
                                    {factor.average && ` (Avg: ${factor.average})`}
                                    {factor.trend && ` trend ${factor.trend}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Analytics Preview */}
            <div className="p-6 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-slate-800 transition-colors mt-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                    <iconify-icon icon="solar:chart-square-linear"></iconify-icon> System Analytics Snapshot
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Mini Chart 1 */}
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-2">Confidence Calibration</h4>
                        <div className="h-16 flex items-end gap-1">
                            <div className="w-1/5 bg-blue-100 dark:bg-blue-900/30 h-[30%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-blue-200 dark:bg-blue-800/40 h-[50%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-blue-300 dark:bg-blue-700/50 h-[80%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-blue-500 dark:bg-blue-600 h-[60%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-blue-600 dark:bg-blue-500 h-[90%] rounded-t-sm"></div>
                        </div>
                    </div>
                    {/* Mini Chart 2 */}
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-2">Prediction Accuracy</h4>
                        <div className="h-16 relative flex items-center justify-center">
                            <svg viewBox="0 0 36 36" className="w-12 h-12 text-emerald-500 transform -rotate-90">
                                <path className="text-gray-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                                <path className="" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="4"></path>
                            </svg>
                            <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">85%</span>
                        </div>
                    </div>
                    {/* Mini Chart 3 */}
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm col-span-2">
                        <h4 className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-2">Data Quality Impact</h4>
                        <div className="h-16 flex items-center justify-between px-2 relative">
                            <div className="absolute inset-0 top-1/2 h-px bg-gray-100 dark:bg-slate-800"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-4"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 -mt-2"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-1"></div>
                            <div className="w-2 h-2 rounded-full bg-red-400 -mt-6"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
