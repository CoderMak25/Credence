import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import DemoControls from './components/DemoControls';
import FilterBar from './components/FilterBar';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
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
            needsIntervention: studentList.filter(s => s.riskLevel === 'high' && s.confidence >= 50).length
        };
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
            const newStudent = { ...s, lmsLoginsPerWeek: null, lateSubmissionsCount: null };
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

    // Filter and sort students
    const filteredStudents = useMemo(() => {
        let result = [...students];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(term) ||
                s.studentId.toLowerCase().includes(term)
            );
        }

        // Sort
        if (sortBy === 'risk') {
            result.sort((a, b) => b.riskScore - a.riskScore);
        } else {
            result.sort((a, b) => a.confidence - b.confidence);
        }

        return result;
    }, [students, searchTerm, sortBy]);

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
        <div className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 h-screen overflow-hidden flex selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                <Header />

                <div className="flex-1 overflow-y-auto custom-scroll p-8">
                    <StatsCards summary={summary} />

                    <div className="flex flex-col gap-6 mb-6">
                        <DemoControls
                            onRemoveAttendance={handleRemoveAttendance}
                            onRemoveQuiz={handleRemoveQuiz}
                            onRemoveOptional={handleRemoveOptional}
                            onReset={handleReset}
                            demoActive={demoActive}
                        />

                        <FilterBar
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
                        <StudentList
                            students={filteredStudents}
                            selectedStudent={selectedStudent}
                            onSelectStudent={setSelectedStudent}
                        />
                        <StudentDetail student={selectedStudent} />
                    </div>
                </div>
            </main>
        </div>
    );
}
