export default function StatsCards({ summary }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Students */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 dark:hover:border-blue-900 transition-colors group">
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</span>
                    <iconify-icon icon="solar:users-group-two-rounded-linear" class="text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-lg" width="20"></iconify-icon>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{summary.totalStudents.toLocaleString()}</span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">+4%</span>
                </div>
            </div>

            {/* High Risk */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-red-200 dark:hover:border-red-900 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-bl-full -mr-2 -mt-2 opacity-50"></div>
                <div className="flex justify-between items-start z-10">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">High Risk Students</span>
                    <iconify-icon icon="solar:danger-triangle-linear" class="text-red-500 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-lg" width="20"></iconify-icon>
                </div>
                <div className="flex items-baseline gap-2 z-10">
                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{summary.highRiskStudents}</span>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">Urgent</span>
                </div>
            </div>

            {/* Low Confidence */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-amber-200 dark:hover:border-amber-900 transition-colors">
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Confidence Data</span>
                    <iconify-icon icon="solar:shield-warning-linear" class="text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-lg" width="20"></iconify-icon>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{summary.lowConfidenceCount}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">assessments flagged</span>
                </div>
            </div>

            {/* Needs Intervention */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 border-l-4 border-l-purple-500">
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Needs Intervention</span>
                    <iconify-icon icon="solar:bell-bing-linear" class="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded-lg" width="20"></iconify-icon>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{summary.needsIntervention}</span>
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">New today</span>
                </div>
            </div>
        </div>
    );
}
