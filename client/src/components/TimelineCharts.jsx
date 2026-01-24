import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Dot } from 'recharts';

/**
 * TimelineCharts - Decision context charts for Academic Health Timeline
 * Shows weekly trends with monthly baseline for pattern recognition
 */

// Custom dot that shows differently for missing data
const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props;
    if (payload[dataKey] === null || payload[dataKey] === undefined) {
        return null; // Don't render dot for missing data
    }
    return <Dot {...props} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2} />;
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        if (value === null || value === undefined) {
            return (
                <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                    {label}: No data
                </div>
            );
        }
        return (
            <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                {label}: {typeof value === 'number' ? value.toFixed(1) : value}{payload[0].unit || ''}
            </div>
        );
    }
    return null;
};

/**
 * Attendance Chart - Shows weekly attendance with monthly average baseline
 */
export function AttendanceChart({ weeklyData, monthlyAverage }) {
    const data = weeklyData?.map(w => ({
        name: `W${w.week}`,
        value: w.attendancePercentage,
        week: w.week
    })) || [];

    const avg = monthlyAverage != null ? monthlyAverage * 100 : null;

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Attendance Trend
                </h4>
                {avg != null && (
                    <span className="text-[10px] text-slate-400">
                        Avg: {avg.toFixed(0)}%
                    </span>
                )}
            </div>
            <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                            ticks={[0, 50, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {avg != null && (
                            <ReferenceLine
                                y={avg}
                                stroke="#94a3b8"
                                strokeDasharray="4 4"
                                strokeWidth={1}
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={<CustomDot dataKey="value" />}
                            connectNulls={false}
                            unit="%"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {data.some(d => d.value == null) && (
                <p className="text-[10px] text-amber-500 mt-1">
                    ⚠ Data missing for some weeks
                </p>
            )}
        </div>
    );
}

/**
 * Quiz Performance Chart - Only plots weeks where quizzes occurred
 */
export function QuizChart({ weeklyData, monthlyAverage }) {
    // Mark weeks without quizzes as null
    const data = weeklyData?.map(w => ({
        name: `W${w.week}`,
        value: w.quizConducted ? w.quizScore : null,
        quizConducted: w.quizConducted,
        week: w.week
    })) || [];

    const quizWeeks = data.filter(d => d.quizConducted);
    const hasQuizData = quizWeeks.length > 0;

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quiz Performance
                </h4>
                {monthlyAverage != null && (
                    <span className="text-[10px] text-slate-400">
                        Avg: {monthlyAverage.toFixed(0)}
                    </span>
                )}
            </div>
            <div className="h-28">
                {hasQuizData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                ticks={[0, 50, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {monthlyAverage != null && (
                                <ReferenceLine
                                    y={monthlyAverage}
                                    stroke="#94a3b8"
                                    strokeDasharray="4 4"
                                    strokeWidth={1}
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={<CustomDot dataKey="value" />}
                                connectNulls={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                        No quizzes conducted
                    </div>
                )}
            </div>
            {hasQuizData && quizWeeks.length < 4 && (
                <p className="text-[10px] text-slate-400 mt-1">
                    Quizzes in {quizWeeks.length}/4 weeks
                </p>
            )}
        </div>
    );
}

/**
 * LMS Activity Chart - Shows login trends
 */
export function LMSChart({ weeklyData, monthlyAverage }) {
    const data = weeklyData?.map(w => ({
        name: `W${w.week}`,
        value: w.lmsLogins,
        week: w.week
    })) || [];

    const maxLogins = Math.max(...data.map(d => d.value || 0), 10);

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    LMS Activity
                </h4>
                {monthlyAverage != null && (
                    <span className="text-[10px] text-slate-400">
                        Avg: {monthlyAverage.toFixed(1)}/wk
                    </span>
                )}
            </div>
            <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, maxLogins + 2]}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {monthlyAverage != null && (
                            <ReferenceLine
                                y={monthlyAverage}
                                stroke="#94a3b8"
                                strokeDasharray="4 4"
                                strokeWidth={1}
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            dot={<CustomDot dataKey="value" />}
                            connectNulls={false}
                            unit=" logins"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/**
 * Assignment Submission Chart - Shows completion rate per week
 */
export function AssignmentChart({ weeklyData, monthlyRate }) {
    // Calculate weekly completion rates
    const data = weeklyData?.map(w => {
        const given = w.assignmentsGiven || 0;
        const submitted = w.assignmentsSubmitted || 0;
        return {
            name: `W${w.week}`,
            value: given > 0 ? (submitted / given) * 100 : null,
            given,
            submitted,
            week: w.week
        };
    }) || [];

    const hasAssignments = data.some(d => d.given > 0);
    const avgRate = monthlyRate != null ? monthlyRate * 100 : null;

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Assignment Submission
                </h4>
                {avgRate != null && (
                    <span className="text-[10px] text-slate-400">
                        Avg: {avgRate.toFixed(0)}%
                    </span>
                )}
            </div>
            <div className="h-28">
                {hasAssignments ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                ticks={[0, 50, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {avgRate != null && (
                                <ReferenceLine
                                    y={avgRate}
                                    stroke="#94a3b8"
                                    strokeDasharray="4 4"
                                    strokeWidth={1}
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={<CustomDot dataKey="value" />}
                                connectNulls={false}
                                unit="%"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                        No assignments given
                    </div>
                )}
            </div>
            {hasAssignments && data.filter(d => d.given === 0).length > 0 && (
                <p className="text-[10px] text-slate-400 mt-1">
                    N/A weeks = no assignments given
                </p>
            )}
        </div>
    );
}
