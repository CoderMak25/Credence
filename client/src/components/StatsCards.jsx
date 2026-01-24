/**
 * StatsCards - Dashboard summary cards that navigate to filtered Students views
 */
export default function StatsCards({ summary, onNavigate }) {
    const cards = [
        {
            id: 'all',
            label: 'Total Students',
            value: summary.totalStudents.toLocaleString(),
            badge: '+4%',
            badgeColor: 'emerald',
            icon: 'solar:users-group-two-rounded-linear',
            iconColor: 'blue',
            hoverBorder: 'hover:border-blue-200 dark:hover:border-blue-900'
        },
        {
            id: 'high-risk',
            label: 'High Risk Students',
            value: summary.highRiskStudents,
            badge: 'Urgent',
            badgeColor: 'red',
            icon: 'solar:danger-triangle-linear',
            iconColor: 'red',
            hoverBorder: 'hover:border-red-200 dark:hover:border-red-900',
            hasGradient: true
        },
        {
            id: 'low-confidence',
            label: 'Low Confidence Data',
            value: summary.lowConfidenceCount,
            subtext: 'assessments flagged',
            icon: 'solar:shield-warning-linear',
            iconColor: 'amber',
            hoverBorder: 'hover:border-amber-200 dark:hover:border-amber-900'
        },
        {
            id: 'intervention',
            label: 'Needs Intervention',
            value: summary.needsIntervention,
            badge: 'Action needed',
            badgeColor: 'purple',
            icon: 'solar:bell-bing-linear',
            iconColor: 'purple',
            hasBorderLeft: true
        }
    ];

    const getIconClasses = (color) => {
        const colors = {
            blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
            red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
            amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
            purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
        };
        return colors[color] || colors.blue;
    };

    const getBadgeClasses = (color) => {
        const colors = {
            emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
            red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
            purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
        };
        return colors[color] || colors.emerald;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map(card => (
                <button
                    key={card.id}
                    onClick={() => onNavigate('students', card.id)}
                    className={`bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 transition-all cursor-pointer text-left group ${card.hoverBorder || ''} ${card.hasBorderLeft ? 'border-l-4 border-l-purple-500' : ''} hover:shadow-md hover:-translate-y-0.5`}
                >
                    {/* Gradient decoration */}
                    {card.hasGradient && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-bl-full -mr-2 -mt-2 opacity-50"></div>
                    )}

                    <div className="flex justify-between items-start z-10">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            {card.label}
                        </span>
                        <iconify-icon
                            icon={card.icon}
                            class={`${getIconClasses(card.iconColor)} p-1.5 rounded-lg`}
                            width="20"
                        ></iconify-icon>
                    </div>

                    <div className="flex items-baseline gap-2 z-10">
                        <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {card.value}
                        </span>
                        {card.badge && (
                            <span className={`text-xs font-medium ${getBadgeClasses(card.badgeColor)} px-1.5 py-0.5 rounded`}>
                                {card.badge}
                            </span>
                        )}
                        {card.subtext && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                {card.subtext}
                            </span>
                        )}
                    </div>

                    {/* Click indicator */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <iconify-icon icon="solar:arrow-right-linear" class="text-slate-400" width="16"></iconify-icon>
                    </div>
                </button>
            ))}
        </div>
    );
}
