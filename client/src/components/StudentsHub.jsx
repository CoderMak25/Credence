import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import FilterBar from './FilterBar';

/**
 * StudentsHub - Main students view with tabbed filters
 * Supports: All, High Risk, Needs Intervention, Low Confidence
 */
export default function StudentsHub({
    students,
    selectedStudent,
    onSelectStudent,
    activeFilter,
    onFilterChange,
    sortBy,
    onSortChange,
    searchTerm,
    onSearchChange
}) {
    // Define filter tabs
    const tabs = [
        { id: 'all', label: 'All Students', icon: 'solar:users-group-rounded-linear' },
        { id: 'high-risk', label: 'High Risk', icon: 'solar:danger-triangle-linear', color: 'red' },
        { id: 'intervention', label: 'Needs Intervention', icon: 'solar:bell-bing-linear', color: 'purple' },
        { id: 'low-confidence', label: 'Low Confidence', icon: 'solar:shield-warning-linear', color: 'amber' }
    ];

    // Get filtered students based on active filter
    const getFilteredStudents = () => {
        let filtered = [...students];

        switch (activeFilter) {
            case 'high-risk':
                filtered = filtered.filter(s => s.riskLevel === 'high');
                filtered.sort((a, b) => b.riskScore - a.riskScore);
                break;
            case 'intervention':
                // High risk with sufficient confidence OR medium risk with declining trends
                filtered = filtered.filter(s =>
                    (s.riskLevel === 'high' && s.confidence >= 50) ||
                    (s.riskLevel === 'medium' && s.confidence >= 60)
                );
                filtered.sort((a, b) => {
                    // Prioritize high risk + high confidence
                    const aScore = (a.riskLevel === 'high' ? 100 : 50) + a.confidence;
                    const bScore = (b.riskLevel === 'high' ? 100 : 50) + b.confidence;
                    return bScore - aScore;
                });
                break;
            case 'low-confidence':
                filtered = filtered.filter(s => s.confidence < 60);
                filtered.sort((a, b) => a.confidence - b.confidence);
                break;
            default:
                // Apply normal sort
                if (sortBy === 'risk') {
                    filtered.sort((a, b) => b.riskScore - a.riskScore);
                } else {
                    filtered.sort((a, b) => a.confidence - b.confidence);
                }
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(term) ||
                s.studentId.toLowerCase().includes(term)
            );
        }

        return filtered;
    };

    const filteredStudents = getFilteredStudents();

    // Get count for each filter
    const getCounts = () => ({
        all: students.length,
        'high-risk': students.filter(s => s.riskLevel === 'high').length,
        intervention: students.filter(s =>
            (s.riskLevel === 'high' && s.confidence >= 50) ||
            (s.riskLevel === 'medium' && s.confidence >= 60)
        ).length,
        'low-confidence': students.filter(s => s.confidence < 60).length
    });

    const counts = getCounts();

    return (
        <div className="flex flex-col h-full">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeFilter === tab.id
                                ? tab.color === 'red'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800'
                                    : tab.color === 'purple'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-800'
                                        : tab.color === 'amber'
                                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <iconify-icon icon={tab.icon} width="16"></iconify-icon>
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded text-xs ${activeFilter === tab.id
                                ? 'bg-white/50 dark:bg-black/20'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}>
                            {counts[tab.id]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search & Sort (only for All view) */}
            {activeFilter === 'all' && (
                <FilterBar
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                />
            )}

            {/* Context message for filtered views */}
            {activeFilter !== 'all' && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${activeFilter === 'high-risk'
                        ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/30'
                        : activeFilter === 'intervention'
                            ? 'bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30'
                            : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30'
                    }`}>
                    {activeFilter === 'high-risk' && (
                        <>
                            <strong>High Risk Students</strong> — Sorted by risk score (highest first).
                            These students show multiple concerning academic signals.
                        </>
                    )}
                    {activeFilter === 'intervention' && (
                        <>
                            <strong>Needs Intervention</strong> — Students where action is recommended.
                            Excludes low-confidence assessments to prevent false alarms.
                        </>
                    )}
                    {activeFilter === 'low-confidence' && (
                        <>
                            <strong>Low Confidence Data</strong> — Assessments with incomplete data.
                            Additional data required before taking action.
                        </>
                    )}
                </div>
            )}

            {/* Student List + Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                <StudentList
                    students={filteredStudents}
                    selectedStudent={selectedStudent}
                    onSelectStudent={onSelectStudent}
                />
                <StudentDetail student={selectedStudent} />
            </div>
        </div>
    );
}
