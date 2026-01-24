/**
 * Header - Dynamic header showing current view context
 */
export default function Header({ activeView, studentsFilter }) {
    const getTitle = () => {
        if (activeView === 'dashboard') {
            return {
                title: 'Academic Risk Advisor',
                subtitle: 'Confidence-aware student risk assessment for informed intervention'
            };
        }

        if (activeView === 'analytics') {
            return {
                title: 'Analytics',
                subtitle: 'Institution-level insights for informed decision-making'
            };
        }

        const filterLabels = {
            'all': { title: 'All Students', subtitle: 'Browse and search all enrolled students' },
            'high-risk': { title: 'High Risk Students', subtitle: 'Students with multiple concerning academic signals' },
            'intervention': { title: 'Needs Intervention', subtitle: 'Action-ready students with sufficient data confidence' },
            'low-confidence': { title: 'Low Confidence Data', subtitle: 'Assessments requiring additional data before action' }
        };

        return filterLabels[studentsFilter] || filterLabels.all;
    };

    const { title, subtitle } = getTitle();

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-5 flex justify-between items-center shrink-0 transition-colors duration-300">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                    {activeView === 'students' && (
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            Students
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative">
                    <iconify-icon icon="solar:bell-linear" width="20" stroke-width="1.5"></iconify-icon>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <iconify-icon icon="solar:question-circle-linear" width="20" stroke-width="1.5"></iconify-icon>
                </button>
            </div>
        </header>
    );
}
