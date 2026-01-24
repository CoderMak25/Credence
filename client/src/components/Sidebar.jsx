import { useState } from 'react';

export default function Sidebar({ activeView, onNavigate }) {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            setIsDark(false);
        } else {
            html.classList.add('dark');
            setIsDark(true);
        }
    };

    const navItems = [
        { id: 'dashboard', icon: 'solar:widget-linear', label: 'Dashboard' },
        { id: 'students', icon: 'solar:users-group-rounded-linear', label: 'Students' },
        { id: 'analytics', icon: 'solar:chart-2-linear', label: 'Analytics' }
    ];

    return (
        <nav className="w-20 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center py-6 h-full flex-shrink-0 z-20 transition-colors duration-300">
            {/* Logo */}
            <div className="mb-10 text-xl font-semibold tracking-tighter text-blue-600 dark:text-blue-500 border-2 border-blue-600 dark:border-blue-500 rounded w-10 h-10 flex items-center justify-center">
                CR
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-4 w-full px-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && onNavigate(item.id)}
                        disabled={item.disabled}
                        className={`group flex items-center justify-center w-full aspect-square rounded-lg relative transition-colors ${activeView === item.id || (item.id === 'students' && activeView.startsWith('students'))
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : item.disabled
                                ? 'text-gray-300 dark:text-slate-700 cursor-not-allowed'
                                : 'text-gray-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <iconify-icon icon={item.icon} width="24" stroke-width="1.5"></iconify-icon>
                        <span className="absolute left-full ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {item.label}
                        </span>
                        {/* Active indicator */}
                        {(activeView === item.id || (item.id === 'students' && activeView.startsWith('students'))) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-4 w-full px-2">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="group flex items-center justify-center w-full aspect-square rounded-lg text-gray-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors relative"
                >
                    {isDark ? (
                        <iconify-icon icon="solar:moon-stars-linear" width="24" stroke-width="1.5"></iconify-icon>
                    ) : (
                        <iconify-icon icon="solar:sun-2-linear" width="24" stroke-width="1.5"></iconify-icon>
                    )}
                    <span className="absolute left-full ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                <button className="group flex items-center justify-center w-full aspect-square rounded-lg text-gray-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors relative">
                    <iconify-icon icon="solar:settings-linear" width="24" stroke-width="1.5"></iconify-icon>
                    <span className="absolute left-full ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        Settings
                    </span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mx-auto border-2 border-white dark:border-slate-800"></div>
            </div>
        </nav>
    );
}
