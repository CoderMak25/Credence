import { useMemo } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, LabelList
} from 'recharts';

/**
 * AnalyticsPage - Institution-level analytics for administrators
 * Now uses passed students data to reflect demo mode changes
 */
export default function AnalyticsPage({ students, demoActive, onNavigate }) {
    // Compute all analytics from the students prop
    const analytics = useMemo(() => {
        if (!students || students.length === 0) {
            return null;
        }

        const totalStudents = students.length;

        // === SECTION 1: Institutional Health Overview ===
        const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
        const mediumRiskCount = students.filter(s => s.riskLevel === 'medium').length;
        const lowRiskCount = students.filter(s => s.riskLevel === 'low').length;

        const avgRiskScore = totalStudents > 0
            ? Math.round(students.reduce((sum, s) => sum + (s.riskScore || 0), 0) / totalStudents)
            : 0;
        const avgConfidence = totalStudents > 0
            ? Math.round(students.reduce((sum, s) => sum + (s.confidence || 0), 0) / totalStudents)
            : 0;

        const institutionalHealth = {
            totalStudents,
            riskDistribution: {
                high: { count: highRiskCount, percentage: Math.round((highRiskCount / totalStudents) * 100) || 0 },
                medium: { count: mediumRiskCount, percentage: Math.round((mediumRiskCount / totalStudents) * 100) || 0 },
                low: { count: lowRiskCount, percentage: Math.round((lowRiskCount / totalStudents) * 100) || 0 }
            },
            avgRiskScore,
            avgConfidence
        };

        // === SECTION 2: Risk Distribution by Department & Year ===
        const departmentStats = {};
        const yearStats = {};

        students.forEach(s => {
            // Department aggregation
            if (!departmentStats[s.department]) {
                departmentStats[s.department] = { total: 0, high: 0, medium: 0, low: 0 };
            }
            departmentStats[s.department].total++;
            departmentStats[s.department][s.riskLevel]++;

            // Year aggregation
            const yearKey = `Year ${s.year}`;
            if (!yearStats[yearKey]) {
                yearStats[yearKey] = { total: 0, high: 0, medium: 0, low: 0 };
            }
            yearStats[yearKey].total++;
            yearStats[yearKey][s.riskLevel]++;
        });

        const riskByDepartment = Object.entries(departmentStats).map(([name, stats]) => ({
            name,
            total: stats.total,
            highRisk: stats.high,
            highRiskPct: Math.round((stats.high / stats.total) * 100),
            mediumRisk: stats.medium,
            lowRisk: stats.low
        })).sort((a, b) => b.highRiskPct - a.highRiskPct);

        const riskByYear = Object.entries(yearStats).map(([name, stats]) => ({
            name,
            total: stats.total,
            highRisk: stats.high,
            highRiskPct: Math.round((stats.high / stats.total) * 100),
            mediumRisk: stats.medium,
            lowRisk: stats.low
        })).sort((a, b) => a.name.localeCompare(b.name));

        // === SECTION 3: Confidence & Data Quality ===
        const gradeA = students.filter(s => s.confidence >= 85).length;
        const gradeB = students.filter(s => s.confidence >= 70 && s.confidence < 85).length;
        const gradeC = students.filter(s => s.confidence >= 50 && s.confidence < 70).length;
        const gradeD = students.filter(s => s.confidence < 50).length;

        const missingAttendance = students.filter(s => s.attendanceRate === null).length;
        const missingQuiz = students.filter(s => s.quizAverage === null).length;
        const missingAssignment = students.filter(s => s.assignmentCompletionRate === null).length;
        const missingLMS = students.filter(s => s.lmsLoginsPerWeek === null).length;

        const confidenceAnalytics = {
            gradeDistribution: {
                A: { count: gradeA, percentage: Math.round((gradeA / totalStudents) * 100) || 0 },
                B: { count: gradeB, percentage: Math.round((gradeB / totalStudents) * 100) || 0 },
                C: { count: gradeC, percentage: Math.round((gradeC / totalStudents) * 100) || 0 },
                D: { count: gradeD, percentage: Math.round((gradeD / totalStudents) * 100) || 0 }
            },
            lowConfidenceCount: gradeC + gradeD,
            missingDataFrequency: {
                attendance: { count: missingAttendance, percentage: Math.round((missingAttendance / totalStudents) * 100) || 0 },
                quiz: { count: missingQuiz, percentage: Math.round((missingQuiz / totalStudents) * 100) || 0 },
                assignment: { count: missingAssignment, percentage: Math.round((missingAssignment / totalStudents) * 100) || 0 },
                lms: { count: missingLMS, percentage: Math.round((missingLMS / totalStudents) * 100) || 0 }
            }
        };

        // === SECTION 4: Intervention Effectiveness (Simulated) ===
        const interventionStudents = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');
        const interventionCount = Math.min(interventionStudents.length, Math.floor(totalStudents * 0.3));

        const interventionStats = {
            simulated: true,
            totalInterventions: interventionCount,
            improved: Math.floor(interventionCount * 0.45),
            noChange: Math.floor(interventionCount * 0.35),
            pendingFollowUp: Math.ceil(interventionCount * 0.20)
        };

        return {
            institutionalHealth,
            riskByDepartment,
            riskByYear,
            confidenceAnalytics,
            interventionStats
        };
    }, [students]);

    if (!students || students.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <iconify-icon icon="solar:danger-triangle-linear" class="text-red-500" width="32"></iconify-icon>
                <p className="text-red-600 dark:text-red-400 mt-2">No analytics data available</p>
            </div>
        );
    }

    const { institutionalHealth, riskByDepartment, riskByYear, confidenceAnalytics, interventionStats } = analytics;

    // Chart colors
    const RISK_COLORS = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981'
    };

    const CONFIDENCE_COLORS = {
        A: '#10b981',
        B: '#3b82f6',
        C: '#f59e0b',
        D: '#ef4444'
    };

    // Prepare pie chart data - sorted by count for layered effect (smallest to largest)
    const riskPieData = [
        { name: 'High Risk', value: institutionalHealth.riskDistribution.high.count, color: RISK_COLORS.high },
        { name: 'Medium Risk', value: institutionalHealth.riskDistribution.medium.count, color: RISK_COLORS.medium },
        { name: 'Low Risk', value: institutionalHealth.riskDistribution.low.count, color: RISK_COLORS.low }
    ].sort((a, b) => a.value - b.value);

    // Pie chart sizing configuration
    const PIE_BASE_RADIUS = 45;
    const PIE_SIZE_INCREMENT = 12;
    const pieTotalValue = riskPieData.reduce((sum, d) => sum + d.value, 0);

    // Confidence grade data for bar chart
    const confidenceBarData = Object.entries(confidenceAnalytics.gradeDistribution).map(([grade, data]) => ({
        grade: `Grade ${grade}`,
        count: data.count,
        fill: CONFIDENCE_COLORS[grade],
        dataKey: grade
    }));

    // Missing data frequency
    const missingDataBars = [
        { name: 'Attendance', value: confidenceAnalytics.missingDataFrequency.attendance.percentage },
        { name: 'Quiz', value: confidenceAnalytics.missingDataFrequency.quiz.percentage },
        { name: 'Assignment', value: confidenceAnalytics.missingDataFrequency.assignment.percentage },
        { name: 'LMS Activity', value: confidenceAnalytics.missingDataFrequency.lms.percentage }
    ];

    return (
        <div className="space-y-8">
            {/* Demo Mode Indicator */}
            {demoActive && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                        <strong>Demo Mode Active</strong> — Analytics reflect simulated data loss. Reset from Dashboard to restore original data.
                    </p>
                </div>
            )}

            {/* ========= SECTION 1: Institutional Health Overview ========= */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <iconify-icon icon="solar:graph-linear" class="text-blue-500" width="24"></iconify-icon>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Institutional Health Overview</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Key metrics */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Students Monitored</p>
                            <p className="text-3xl font-semibold text-slate-900 dark:text-white mt-1">
                                {institutionalHealth.totalStudents.toLocaleString()}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Avg Risk Score</p>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">
                                    {institutionalHealth.avgRiskScore}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Avg Confidence</p>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">
                                    {institutionalHealth.avgConfidence}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Center: Layered Concentric Ring Chart */}
                    <div className="flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                {riskPieData.map((entry, index) => {
                                    const cumulativeBefore = riskPieData
                                        .slice(0, index)
                                        .reduce((sum, d) => sum + d.value, 0);
                                    const cumulativeAfter = cumulativeBefore + entry.value;
                                    const startAngle = (cumulativeBefore / pieTotalValue) * 360;
                                    const endAngle = (cumulativeAfter / pieTotalValue) * 360;

                                    return (
                                        <Pie
                                            key={`pie-${index}`}
                                            data={[entry]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={PIE_BASE_RADIUS + index * PIE_SIZE_INCREMENT}
                                            dataKey="value"
                                            nameKey="name"
                                            cornerRadius={4}
                                            startAngle={startAngle}
                                            endAngle={endAngle}
                                        >
                                            <Cell fill={entry.color} />
                                            <LabelList
                                                dataKey="value"
                                                position="inside"
                                                style={{
                                                    fill: '#fff',
                                                    fontSize: 11,
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Pie>
                                    );
                                })}
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Risk Distribution</p>
                    </div>

                    {/* Right: Risk breakdown with clickable items */}
                    <div className="space-y-3">
                        {[
                            { level: 'high', label: 'High Risk', data: institutionalHealth.riskDistribution.high },
                            { level: 'medium', label: 'Medium Risk', data: institutionalHealth.riskDistribution.medium },
                            { level: 'low', label: 'Low Risk', data: institutionalHealth.riskDistribution.low }
                        ].map(item => (
                            <button
                                key={item.level}
                                onClick={() => onNavigate('students', item.level === 'high' ? 'high-risk' : 'all')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: RISK_COLORS[item.level] }}
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {item.data.count}
                                    </span>
                                    <span className="text-sm text-slate-500">({item.data.percentage}%)</span>
                                    <iconify-icon
                                        icon="solar:arrow-right-linear"
                                        class="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        width="16"
                                    ></iconify-icon>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========= SECTION 2: Risk Distribution & Trends ========= */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <iconify-icon icon="solar:chart-2-linear" class="text-purple-500" width="24"></iconify-icon>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Risk Distribution & Concentration</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk by Department - Glowing Stacked Bars */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">By Department</h3>
                        <ResponsiveContainer width="100%" height={riskByDepartment.length * 50 + 20}>
                            <BarChart
                                data={riskByDepartment}
                                layout="vertical"
                                margin={{ left: 0, right: 30 }}
                                barGap={0}
                            >
                                <defs>
                                    <filter id="glow-high" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feFlood floodColor="#ef4444" floodOpacity="0.5" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glow-medium" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feFlood floodColor="#f59e0b" floodOpacity="0.5" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glow-low" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feFlood floodColor="#10b981" floodOpacity="0.5" />
                                        <feComposite in2="blur" operator="in" />
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <XAxis type="number" hide domain={[0, 'dataMax']} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={120}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value, name) => [value, name === 'highRisk' ? 'High Risk' : name === 'mediumRisk' ? 'Medium Risk' : 'Low Risk']}
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                />
                                <Bar
                                    dataKey="highRisk"
                                    stackId="risk"
                                    fill="#ef4444"
                                    barSize={12}
                                    radius={[4, 0, 0, 4]}
                                    style={{ filter: 'url(#glow-high)' }}
                                />
                                <Bar
                                    dataKey="mediumRisk"
                                    stackId="risk"
                                    fill="#f59e0b"
                                    barSize={12}
                                    style={{ filter: 'url(#glow-medium)' }}
                                />
                                <Bar
                                    dataKey="lowRisk"
                                    stackId="risk"
                                    fill="#10b981"
                                    barSize={12}
                                    radius={[0, 4, 4, 0]}
                                    style={{ filter: 'url(#glow-low)' }}
                                >
                                    <LabelList
                                        dataKey="total"
                                        position="right"
                                        style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                                        offset={8}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Risk by Year - Glowing Stacked Bars */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">By Year</h3>
                        <ResponsiveContainer width="100%" height={riskByYear.length * 50 + 20}>
                            <BarChart
                                data={riskByYear}
                                layout="vertical"
                                margin={{ left: 0, right: 30 }}
                                barGap={0}
                            >
                                <XAxis type="number" hide domain={[0, 'dataMax']} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={60}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value, name) => [value, name === 'highRisk' ? 'High Risk' : name === 'mediumRisk' ? 'Medium Risk' : 'Low Risk']}
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                />
                                <Bar
                                    dataKey="highRisk"
                                    stackId="risk"
                                    fill="#ef4444"
                                    barSize={12}
                                    radius={[4, 0, 0, 4]}
                                    style={{ filter: 'url(#glow-high)' }}
                                />
                                <Bar
                                    dataKey="mediumRisk"
                                    stackId="risk"
                                    fill="#f59e0b"
                                    barSize={12}
                                    style={{ filter: 'url(#glow-medium)' }}
                                />
                                <Bar
                                    dataKey="lowRisk"
                                    stackId="risk"
                                    fill="#10b981"
                                    barSize={12}
                                    radius={[0, 4, 4, 0]}
                                    style={{ filter: 'url(#glow-low)' }}
                                >
                                    <LabelList
                                        dataKey="total"
                                        position="right"
                                        style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                                        offset={8}
                                        formatter={(value) => `${value} students`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="flex gap-6 mt-4 text-xs text-slate-500">
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> High
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> Medium
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> Low
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========= SECTION 3: Confidence & Data Quality ========= */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <iconify-icon icon="solar:shield-check-linear" class="text-emerald-500" width="24"></iconify-icon>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Confidence & Data Quality</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    How much can we trust the system's assessments? Low confidence ≠ low risk.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Confidence Grade Distribution - Glowing Bars */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Confidence Grade Distribution</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={confidenceBarData} layout="vertical" margin={{ left: -10 }}>
                                <defs>
                                    {Object.entries(CONFIDENCE_COLORS).map(([grade, color]) => (
                                        <filter key={`glow-${grade}`} id={`glow-${grade}`} x="-100%" y="-100%" width="400%" height="400%">
                                            <feGaussianBlur stdDeviation="6" result="blur" />
                                            <feFlood floodColor={color} floodOpacity="0.4" />
                                            <feComposite in2="blur" operator="in" />
                                            <feMerge>
                                                <feMergeNode />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    ))}
                                </defs>
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="grade"
                                    width={75}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    formatter={(value) => [`${value} students`, 'Count']}
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    radius={[0, 6, 6, 0]}
                                    barSize={14}
                                    background={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 6 }}
                                    shape={(props) => {
                                        const { x, y, width, height, fill, payload } = props;
                                        const gradeKey = payload.dataKey;
                                        return (
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                rx={6}
                                                fill={fill}
                                                filter={`url(#glow-${gradeKey})`}
                                                style={{ transition: 'all 0.3s ease' }}
                                            />
                                        );
                                    }}
                                >
                                    <LabelList
                                        dataKey="count"
                                        position="right"
                                        style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                                        offset={8}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>{confidenceAnalytics.lowConfidenceCount}</strong> students have low-confidence assessments (Grade C or D)
                            </p>
                        </div>
                    </div>

                    {/* Missing Data Frequency */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Missing Signal Frequency</h3>
                        <div className="space-y-4">
                            {missingDataBars.map(item => (
                                <div key={item.name} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                                        <span className="text-slate-500">{item.value}% missing</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all"
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => onNavigate('students', 'low-confidence')}
                            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            View low-confidence assessments
                            <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon>
                        </button>
                    </div>
                </div>
            </section>

            {/* ========= SECTION 4: Intervention Effectiveness ========= */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <iconify-icon icon="solar:hand-heart-linear" class="text-rose-500" width="24"></iconify-icon>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Intervention Effectiveness</h2>
                    </div>
                    {interventionStats.simulated && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">
                            Simulated for demonstration
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                            {interventionStats.totalInterventions}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Interventions</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center border border-emerald-200 dark:border-emerald-800">
                        <p className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                            {interventionStats.improved}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Students Improved</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-semibold text-slate-600 dark:text-slate-400">
                            {interventionStats.noChange}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No Change</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center border border-amber-200 dark:border-amber-800">
                        <p className="text-3xl font-semibold text-amber-600 dark:text-amber-400">
                            {interventionStats.pendingFollowUp}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pending Follow-up</p>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('students', 'intervention')}
                    className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                    View students needing intervention
                    <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon>
                </button>
            </section>
        </div>
    );
}
