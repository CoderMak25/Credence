import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import DemoControls from './components/DemoControls';
import StudentsHub from './components/StudentsHub';
import AnalyticsPage from './components/AnalyticsPage';
import { getStudentRiskData } from './services/api';
import { calculateRisk } from './utils/riskCalculator';

export default function App() {
    const [originalData, setOriginalData] = useState({ students: [], summary: {} });
    const [students, setStudents] = useState([]);
    const [summary, setSummary] = useState({
        totalStudents: 0,
        highRiskStudents: 0,
        lowConfidenceCount: 0,
        needsIntervention: 0
    });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [sortBy, setSortBy] = useState('risk');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [demoActive, setDemoActive] = useState(false);

    // Navigation state
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'students'
    const [studentsFilter, setStudentsFilter] = useState('all'); // 'all' | 'high-risk' | 'intervention' | 'low-confidence'

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getStudentRiskData();
                setOriginalData(data);
                setStudents(data.students);
                setSummary(data.summary);
                if (data.students.length > 0) {
                    setSelectedStudent(data.students[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Recalculate summary when students change
    const recalculateSummary = (studentList) => {
        return {
            totalStudents: studentList.length,
            highRiskStudents: studentList.filter(s => s.riskLevel === 'high').length,
            lowConfidenceCount: studentList.filter(s => s.confidence < 60).length,
            needsIntervention: studentList.filter(s =>
                (s.riskLevel === 'high' && s.confidence >= 50) ||
                (s.riskLevel === 'medium' && s.confidence >= 60)
            ).length
        };
    };

    // Navigation handler
    const handleNavigate = (view, filter) => {
        if (view === 'dashboard') {
            setActiveView('dashboard');
        } else if (view === 'students') {
            setActiveView('students');
            if (filter) {
                setStudentsFilter(filter);
            } else {
                setStudentsFilter('all');
            }
        } else if (view === 'analytics') {
            setActiveView('analytics');
        }
    };

    // Demo mode handlers
    const handleRemoveAttendance = () => {
        setDemoActive(true);
        const modified = students.map(s => {
            const newStudent = { ...s, attendanceRate: null };
            const risk = calculateRisk(newStudent);
            return { ...newStudent, ...risk };
        });
        setStudents(modified);
        setSummary(recalculateSummary(modified));
        if (selectedStudent) {
            const updated = modified.find(s => s.studentId === selectedStudent.studentId);
            setSelectedStudent(updated);
        }
    };

    const handleRemoveQuiz = () => {
        setDemoActive(true);
        const modified = students.map(s => {
            const newStudent = { ...s, quizAverage: null };
            const risk = calculateRisk(newStudent);
            return { ...newStudent, ...risk };
        });
        setStudents(modified);
        setSummary(recalculateSummary(modified));
        if (selectedStudent) {
            const updated = modified.find(s => s.studentId === selectedStudent.studentId);
            setSelectedStudent(updated);
        }
    };

    const handleRemoveOptional = () => {
        setDemoActive(true);
        const modified = students.map(s => {
            const newStudent = { ...s, lmsLoginsPerWeek: null, assignmentCompletionRate: null, lateSubmissionsCount: null };
            const risk = calculateRisk(newStudent);
            return { ...newStudent, ...risk };
        });
        setStudents(modified);
        setSummary(recalculateSummary(modified));
        if (selectedStudent) {
            const updated = modified.find(s => s.studentId === selectedStudent.studentId);
            setSelectedStudent(updated);
        }
    };

    const handleReset = () => {
        setDemoActive(false);
        setStudents(originalData.students);
        setSummary(originalData.summary);
        if (selectedStudent) {
            const updated = originalData.students.find(s => s.studentId === selectedStudent.studentId);
            setSelectedStudent(updated);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500 dark:text-slate-400">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center">
                    <iconify-icon icon="solar:danger-triangle-linear" class="text-red-500" width="48"></iconify-icon>
                    <p className="text-red-500 mt-4">{error}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Make sure the backend server is running</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 h-screen overflow-hidden flex flex-col sm:flex-row selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden sm:block">
                <Sidebar activeView={activeView} onNavigate={handleNavigate} />
            </div>

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                <Header activeView={activeView} studentsFilter={studentsFilter} />

                <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6 lg:p-8 pb-20 sm:pb-4">
                    {activeView === 'dashboard' && (
                        <>
                            {/* Dashboard View */}
                            <StatsCards summary={summary} onNavigate={handleNavigate} />

                            <div className="mb-6">
                                <DemoControls
                                    onRemoveAttendance={handleRemoveAttendance}
                                    onRemoveQuiz={handleRemoveQuiz}
                                    onRemoveOptional={handleRemoveOptional}
                                    onReset={handleReset}
                                    demoActive={demoActive}
                                />
                            </div>

                            {/* Quick preview of high-risk students */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Students Requiring Attention
                                    </h2>
                                    <button
                                        onClick={() => handleNavigate('students', 'high-risk')}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        View all
                                        <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {students
                                        .filter(s => s.riskLevel === 'high')
                                        .slice(0, 6)
                                        .map(student => (
                                            <div
                                                key={student.studentId}
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    handleNavigate('students', 'high-risk');
                                                }}
                                                className="p-4 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-medium text-slate-900 dark:text-white">{student.name}</span>
                                                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
                                                        {student.riskScore}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{student.studentId} • {student.department}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </>
                    )}

                    {activeView === 'students' && (
                        <StudentsHub
                            students={students}
                            selectedStudent={selectedStudent}
                            onSelectStudent={setSelectedStudent}
                            activeFilter={studentsFilter}
                            onFilterChange={setStudentsFilter}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    )}

                    {activeView === 'analytics' && (
                        <AnalyticsPage students={students} demoActive={demoActive} onNavigate={handleNavigate} />
                    )}
                </div>
            </main>

            {/* Mobile Bottom Navigation - visible only on mobile */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-4 py-2 flex justify-around items-center z-50">
                <button
                    onClick={() => handleNavigate('dashboard')}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${activeView === 'dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <iconify-icon icon="solar:widget-linear" width="22"></iconify-icon>
                    <span className="text-[10px] font-medium">Dashboard</span>
                </button>
                <button
                    onClick={() => handleNavigate('students')}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${activeView === 'students' || activeView.startsWith('students') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <iconify-icon icon="solar:users-group-rounded-linear" width="22"></iconify-icon>
                    <span className="text-[10px] font-medium">Students</span>
                </button>
                <button
                    onClick={() => handleNavigate('analytics')}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${activeView === 'analytics' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <iconify-icon icon="solar:chart-2-linear" width="22"></iconify-icon>
                    <span className="text-[10px] font-medium">Analytics</span>
                </button>
            </nav>
        </div>
    );
}
