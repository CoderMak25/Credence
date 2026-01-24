import { useState } from 'react';
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
    // Mobile view state - show list or detail
    const [mobileShowDetail, setMobileShowDetail] = useState(false);

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

    // Handle student selection (show detail on mobile)
    const handleSelectStudent = (student) => {
        onSelectStudent(student);
        setMobileShowDetail(true);
    };

    // Handle back button on mobile
    const handleBackToList = () => {
        setMobileShowDetail(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Filter Tabs - horizontally scrollable on mobile */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-2 px-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${activeFilter === tab.id
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
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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
                <div className={`mb-4 p-3 rounded-lg text-xs sm:text-sm ${activeFilter === 'high-risk'
                    ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/30'
                    : activeFilter === 'intervention'
                        ? 'bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30'
                        : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30'
                    }`}>
                    {activeFilter === 'high-risk' && (
                        <>
                            <strong>High Risk Students</strong> — Sorted by risk score (highest first).
                            <span className="hidden sm:inline"> These students show multiple concerning academic signals.</span>
                        </>
                    )}
                    {activeFilter === 'intervention' && (
                        <>
                            <strong>Needs Intervention</strong> — Students where action is recommended.
                            <span className="hidden sm:inline"> Excludes low-confidence assessments to prevent false alarms.</span>
                        </>
                    )}
                    {activeFilter === 'low-confidence' && (
                        <>
                            <strong>Low Confidence Data</strong> — Assessments with incomplete data.
                            <span className="hidden sm:inline"> Additional data required before taking action.</span>
                        </>
                    )}
                </div>
            )}

            {/* Student List + Detail - Responsive Layout */}
            <div className="flex-1 min-h-0 relative">
                {/* Desktop: Side-by-side layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-full">
                    <StudentList
                        students={filteredStudents}
                        selectedStudent={selectedStudent}
                        onSelectStudent={onSelectStudent}
                    />
                    <StudentDetail student={selectedStudent} />
                </div>

                {/* Mobile/Tablet: Show list or detail based on state */}
                <div className="lg:hidden h-full">
                    {!mobileShowDetail ? (
                        <StudentList
                            students={filteredStudents}
                            selectedStudent={selectedStudent}
                            onSelectStudent={handleSelectStudent}
                            isMobile={true}
                        />
                    ) : (
                        <div className="h-full flex flex-col">
                            {/* Back button */}
                            <button
                                onClick={handleBackToList}
                                className="flex items-center gap-2 mb-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-fit"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" width="16"></iconify-icon>
                                Back to List
                            </button>
                            <div className="flex-1 min-h-0">
                                <StudentDetail student={selectedStudent} isMobile={true} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

