import StudentCard from './StudentCard';

export default function StudentList({ students, selectedStudent, onSelectStudent }) {
    return (
        <div className="lg:col-span-4 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student Roster</span>
                <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-2 py-0.5 rounded-full">Viewing {students.length}</span>
            </div>

            <div className="overflow-y-auto custom-scroll p-3 space-y-3 flex-1">
                {students.map((student) => (
                    <StudentCard
                        key={student.studentId}
                        student={student}
                        isSelected={selectedStudent?.studentId === student.studentId}
                        onClick={() => onSelectStudent(student)}
                    />
                ))}
                {students.length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        No students found
                    </div>
                )}
            </div>
        </div>
    );
}
