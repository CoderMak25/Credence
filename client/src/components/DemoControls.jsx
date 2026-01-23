export default function DemoControls({ onRemoveAttendance, onRemoveQuiz, onRemoveOptional, onReset, demoActive }) {
    return (
        <div className="bg-purple-50/60 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-purple-900 dark:text-purple-200">🎭 Demo Mode: Simulate Data Loss</h3>
                    <span className="flex h-2 w-2 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${demoActive ? 'bg-red-400' : 'bg-purple-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${demoActive ? 'bg-red-500' : 'bg-purple-500'}`}></span>
                    </span>
                </div>
                <p className="text-sm text-purple-700/70 dark:text-purple-300/50 max-w-xl">
                    Manipulate student data streams in real-time to observe how the model's confidence intervals shift.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onRemoveAttendance}
                    className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors shadow-sm"
                >
                    Remove Attendance
                </button>
                <button
                    onClick={onRemoveQuiz}
                    className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors shadow-sm"
                >
                    Remove Quiz Scores
                </button>
                <button
                    onClick={onRemoveOptional}
                    className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                >
                    Remove Optional Data
                </button>
                <button
                    onClick={onReset}
                    className="px-3 py-2 rounded-lg bg-emerald-500 dark:bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1"
                >
                    <iconify-icon icon="solar:refresh-linear"></iconify-icon> Reset Data
                </button>
            </div>
        </div>
    );
}
